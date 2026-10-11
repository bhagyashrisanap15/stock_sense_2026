import React, { useState, useMemo } from 'react';
import { WatchlistItem } from '../../types/stock';
import { WATCHLIST_ITEMS, ALL_STOCKS } from '../../data/stocksData';
import {
  Bookmark,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Search,
  Check,
  Star,
  ExternalLink,
  ShieldCheck,
  Zap,
  BarChart3,
  Flame,
  LayoutGrid,
  Layers,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

interface WatchlistScreenProps {
  onSelectStockAndTab: (symbol: string, tab: 'dashboard' | 'predictions' | 'risk-matrix' | 'xai-explainability') => void;
  onSelectStock: (symbol: string) => void;
  activeStockSymbol: string;
}

type ViewMode = 'split' | 'heatmap' | 'cards';
type SortOption = 'perf-desc' | 'perf-asc' | 'symbol-asc' | 'risk-desc';
type MarketFilter = 'all' | 'gainers' | 'losers' | 'nse' | 'nasdaq';

interface HeatmapColorConfig {
  bg: string;
  hoverBg: string;
  border: string;
  text: string;
  subtext: string;
  badgeBg: string;
  badgeText: string;
  label: string;
}

// Color coding based on percentage change scale
const getHeatmapColor = (changePercent: number): HeatmapColorConfig => {
  if (changePercent >= 3.0) {
    return {
      bg: 'bg-emerald-600/90',
      hoverBg: 'hover:bg-emerald-500',
      border: 'border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      text: 'text-white',
      subtext: 'text-emerald-100',
      badgeBg: 'bg-emerald-950/70',
      badgeText: 'text-emerald-200',
      label: 'Strong Bullish (>+3.0%)',
    };
  }
  if (changePercent >= 1.5) {
    return {
      bg: 'bg-emerald-700/80',
      hoverBg: 'hover:bg-emerald-600',
      border: 'border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
      text: 'text-emerald-50',
      subtext: 'text-emerald-200',
      badgeBg: 'bg-emerald-950/60',
      badgeText: 'text-emerald-300',
      label: 'Bullish (+1.5% to +3.0%)',
    };
  }
  if (changePercent > 0.1) {
    return {
      bg: 'bg-emerald-900/60',
      hoverBg: 'hover:bg-emerald-800/80',
      border: 'border-emerald-700/40',
      text: 'text-emerald-100',
      subtext: 'text-emerald-300/80',
      badgeBg: 'bg-emerald-950/70',
      badgeText: 'text-emerald-300',
      label: 'Mild Bullish (0% to +1.5%)',
    };
  }
  if (changePercent >= -0.1) {
    return {
      bg: 'bg-[#1e293b]/90',
      hoverBg: 'hover:bg-slate-700/80',
      border: 'border-slate-700/60',
      text: 'text-slate-200',
      subtext: 'text-slate-400',
      badgeBg: 'bg-slate-900/80',
      badgeText: 'text-slate-300',
      label: 'Neutral / Flat (0.0%)',
    };
  }
  if (changePercent > -1.5) {
    return {
      bg: 'bg-rose-950/60',
      hoverBg: 'hover:bg-rose-900/80',
      border: 'border-rose-800/40',
      text: 'text-rose-100',
      subtext: 'text-rose-300/80',
      badgeBg: 'bg-rose-950/80',
      badgeText: 'text-rose-300',
      label: 'Mild Bearish (0% to -1.5%)',
    };
  }
  if (changePercent > -3.0) {
    return {
      bg: 'bg-rose-700/80',
      hoverBg: 'hover:bg-rose-600',
      border: 'border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]',
      text: 'text-rose-50',
      subtext: 'text-rose-200',
      badgeBg: 'bg-rose-950/60',
      badgeText: 'text-rose-300',
      label: 'Bearish (-1.5% to -3.0%)',
    };
  }
  return {
    bg: 'bg-red-700/90',
    hoverBg: 'hover:bg-red-600',
    border: 'border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.25)]',
    text: 'text-white',
    subtext: 'text-red-100',
    badgeBg: 'bg-red-950/60',
    badgeText: 'text-red-300',
    label: 'Strong Bearish (<-3.0%)',
  };
};

export const WatchlistScreen: React.FC<WatchlistScreenProps> = ({
  onSelectStockAndTab,
  onSelectStock,
  activeStockSymbol,
}) => {
  const [items, setItems] = useState<WatchlistItem[]>(WATCHLIST_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSymbolInput, setNewSymbolInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [sortBy, setSortBy] = useState<SortOption>('perf-desc');
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('all');
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  // Helper to extract numeric percentage change
  const parsePercent = (val: string): number => {
    const cleaned = val.replace('%', '').replace('+', '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      const pct = parsePercent(item.change);
      if (marketFilter === 'gainers') return pct > 0;
      if (marketFilter === 'losers') return pct < 0;
      if (marketFilter === 'nse') return item.exchange.toUpperCase() === 'NSE' || item.exchange.toUpperCase() === 'BSE';
      if (marketFilter === 'nasdaq') return item.exchange.toUpperCase() === 'NASDAQ';

      return true;
    });
  }, [items, searchQuery, marketFilter]);

  // Sort items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const pctA = parsePercent(a.change);
      const pctB = parsePercent(b.change);

      if (sortBy === 'perf-desc') return pctB - pctA;
      if (sortBy === 'perf-asc') return pctA - pctB;
      if (sortBy === 'symbol-asc') return a.symbol.localeCompare(b.symbol);
      if (sortBy === 'risk-desc') {
        const getRiskScore = (r: string) => {
          const match = r.match(/\d+/);
          return match ? parseInt(match[0], 10) : 50;
        };
        return getRiskScore(b.riskVector) - getRiskScore(a.riskVector);
      }
      return 0;
    });
  }, [filteredItems, sortBy]);

  // Aggregate Market Performance Stats
  const marketStats = useMemo(() => {
    if (items.length === 0) {
      return {
        advancers: 0,
        decliners: 0,
        unchanged: 0,
        averageChange: 0,
        topGainer: null as WatchlistItem | null,
        topLoser: null as WatchlistItem | null,
        bullishBreadthPct: 0,
      };
    }

    let advancers = 0;
    let decliners = 0;
    let unchanged = 0;
    let totalChange = 0;
    let topGainer = items[0];
    let topLoser = items[0];

    items.forEach((item) => {
      const pct = parsePercent(item.change);
      totalChange += pct;
      if (pct > 0.05) advancers++;
      else if (pct < -0.05) decliners++;
      else unchanged++;

      if (pct > parsePercent(topGainer.change)) topGainer = item;
      if (pct < parsePercent(topLoser.change)) topLoser = item;
    });

    const averageChange = totalChange / items.length;
    const bullishBreadthPct = Math.round((advancers / items.length) * 100);

    return {
      advancers,
      decliners,
      unchanged,
      averageChange,
      topGainer,
      topLoser,
      bullishBreadthPct,
    };
  }, [items]);

  const handleRemove = (symbol: string) => {
    setItems((prev) => prev.filter((i) => i.symbol !== symbol));
  };

  const handleAddStock = (sym: string) => {
    const cleanSym = sym.trim().toUpperCase();
    if (!cleanSym) return;

    if (items.some((i) => i.symbol === cleanSym)) {
      setIsAddModalOpen(false);
      setNewSymbolInput('');
      return;
    }

    const stock = ALL_STOCKS[cleanSym];
    const newItem: WatchlistItem = {
      symbol: cleanSym,
      name: stock ? stock.name : `${cleanSym} Corp`,
      exchange: stock ? stock.exchange : 'NSE',
      emoji: '📈',
      price: stock ? stock.priceFormatted : '₹1,000.00',
      change: stock ? `${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%` : '+1.00%',
      isPositive: stock ? stock.change >= 0 : true,
      mlDirection: stock ? `${stock.forecastDirection} ${stock.confidence}%` : 'Bullish 70%',
      riskVector: stock ? `${stock.riskCategory} ${stock.riskScore}` : 'Medium 50',
      xaiSignal: stock ? stock.confirmationChecklist[0]?.name || 'Momentum' : 'Active Channel',
      attention: stock ? stock.technicalNarrative.slice(0, 30) + '...' : 'Tracked Asset',
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewSymbolInput('');
  };

  return (
    <div className="flex flex-col w-full space-y-4 animate-fadeIn">
      {/* Header with Title, View Toggles & Add Stock Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101a2b] p-4 rounded-2xl border border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
              <Bookmark className="w-4 h-4" />
            </div>
            <h1 className="text-[18px] font-bold text-[#f1f5f9] tracking-tight">
              Watchlist Intelligence
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#16243c] text-[#22d3ee] border border-[#22d3ee]/30 font-semibold">
              {items.length} Tracked
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <Flame className="w-3 h-3" />
              Live Heatmap Active
            </span>
          </div>
          <p className="text-[12px] font-mono text-[#94a3b8] mt-1">
            Real-time percentage change heatmap &amp; ML quantitative intelligence
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#070d19] p-1 rounded-xl border border-[#1e293b]">
            <button
              onClick={() => setViewMode('split')}
              title="Split View (Heatmap + Cards)"
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-[#22d3ee]/15 text-[#22d3ee] font-semibold border border-[#22d3ee]/30'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              title="Heatmap Focus"
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'heatmap'
                  ? 'bg-[#22d3ee]/15 text-[#22d3ee] font-semibold border border-[#22d3ee]/30'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Heatmap</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              title="Cards Grid"
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-[#22d3ee]/15 text-[#22d3ee] font-semibold border border-[#22d3ee]/30'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#38bdf8] text-[#083344] font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* Market Breadth & Performance Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 bg-[#101a2b] p-3.5 rounded-xl border border-[#1e293b]">
        {/* Advancers */}
        <div className="bg-[#070d19] p-2.5 rounded-lg border border-[#1e293b]">
          <span className="text-[10px] font-mono uppercase text-[#64748b] block">Advancers</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[14px] font-bold font-mono text-emerald-400">
              {marketStats.advancers}
            </span>
            <span className="text-[10px] font-mono text-[#94a3b8]">
              ({Math.round((marketStats.advancers / (items.length || 1)) * 100)}%)
            </span>
          </div>
        </div>

        {/* Decliners */}
        <div className="bg-[#070d19] p-2.5 rounded-lg border border-[#1e293b]">
          <span className="text-[10px] font-mono uppercase text-[#64748b] block">Decliners</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[14px] font-bold font-mono text-rose-400">
              {marketStats.decliners}
            </span>
            <span className="text-[10px] font-mono text-[#94a3b8]">
              ({Math.round((marketStats.decliners / (items.length || 1)) * 100)}%)
            </span>
          </div>
        </div>

        {/* Watchlist Average Change */}
        <div className="bg-[#070d19] p-2.5 rounded-lg border border-[#1e293b]">
          <span className="text-[10px] font-mono uppercase text-[#64748b] block">Watchlist Avg</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-[14px] font-bold font-mono ${
                marketStats.averageChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {marketStats.averageChange >= 0 ? '+' : ''}
              {marketStats.averageChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Bullish Market Breadth */}
        <div className="bg-[#070d19] p-2.5 rounded-lg border border-[#1e293b]">
          <span className="text-[10px] font-mono uppercase text-[#64748b] block">Market Breadth</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 bg-[#16243c] rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${marketStats.bullishBreadthPct}%` }}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${100 - marketStats.bullishBreadthPct}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#f1f5f9]">
              {marketStats.bullishBreadthPct}%
            </span>
          </div>
        </div>

        {/* Top Performer */}
        {marketStats.topGainer && (
          <div
            onClick={() => onSelectStock(marketStats.topGainer!.symbol)}
            className="cursor-pointer bg-[#070d19] hover:bg-[#16243c] p-2.5 rounded-lg border border-[#1e293b] transition-colors"
            title="Click to select top outperformer"
          >
            <span className="text-[10px] font-mono uppercase text-[#64748b] flex items-center justify-between">
              <span>Top Outperformer</span>
              <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[12px] font-bold font-mono text-[#f1f5f9]">
                {marketStats.topGainer.symbol}
              </span>
              <span className="text-[11px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">
                {marketStats.topGainer.change}
              </span>
            </div>
          </div>
        )}

        {/* Top Lagging Asset */}
        {marketStats.topLoser && (
          <div
            onClick={() => onSelectStock(marketStats.topLoser!.symbol)}
            className="cursor-pointer bg-[#070d19] hover:bg-[#16243c] p-2.5 rounded-lg border border-[#1e293b] transition-colors"
            title="Click to select underperformer"
          >
            <span className="text-[10px] font-mono uppercase text-[#64748b] block">Top Lagging</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[12px] font-bold font-mono text-[#f1f5f9]">
                {marketStats.topLoser.symbol}
              </span>
              <span className="text-[11px] font-bold font-mono text-rose-400 bg-rose-500/10 px-1 py-0.2 rounded">
                {marketStats.topLoser.change}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* HEATMAP SECTION (shown in 'split' or 'heatmap' mode) */}
      {(viewMode === 'split' || viewMode === 'heatmap') && (
        <div className="bg-[#101a2b] p-4 rounded-2xl border border-[#1e293b] space-y-3.5">
          {/* Heatmap Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-[14px] font-bold font-mono text-[#f1f5f9] tracking-wide uppercase flex items-center gap-1.5">
                <span>Performance Heatmap Matrix</span>
              </h2>
              <span className="text-[11px] font-mono text-[#64748b]">
                • Percentage Change ({sortedItems.length} assets)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Category / Market Filters */}
              <div className="flex items-center gap-1 bg-[#070d19] p-0.5 rounded-lg border border-[#1e293b] text-[11px] font-mono">
                <button
                  onClick={() => setMarketFilter('all')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    marketFilter === 'all'
                      ? 'bg-[#16243c] text-[#22d3ee] font-semibold'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  onClick={() => setMarketFilter('gainers')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    marketFilter === 'gainers'
                      ? 'bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-700/50'
                      : 'text-[#94a3b8] hover:text-emerald-300'
                  }`}
                >
                  Gainers ({marketStats.advancers})
                </button>
                <button
                  onClick={() => setMarketFilter('losers')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    marketFilter === 'losers'
                      ? 'bg-rose-950/80 text-rose-300 font-semibold border border-rose-700/50'
                      : 'text-[#94a3b8] hover:text-rose-300'
                  }`}
                >
                  Losers ({marketStats.decliners})
                </button>
                <button
                  onClick={() => setMarketFilter('nse')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    marketFilter === 'nse'
                      ? 'bg-[#16243c] text-[#22d3ee] font-semibold'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  NSE / BSE
                </button>
                <button
                  onClick={() => setMarketFilter('nasdaq')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    marketFilter === 'nasdaq'
                      ? 'bg-[#16243c] text-[#22d3ee] font-semibold'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  NASDAQ
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-[#070d19] px-2.5 py-1 rounded-lg border border-[#1e293b] text-[11px] font-mono text-[#94a3b8]">
                <ArrowUpDown className="w-3 h-3 text-[#22d3ee]" />
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-[#f1f5f9] focus:outline-none cursor-pointer"
                >
                  <option value="perf-desc" className="bg-[#101a2b] text-[#f1f5f9]">
                    Highest Return
                  </option>
                  <option value="perf-asc" className="bg-[#101a2b] text-[#f1f5f9]">
                    Lowest Return
                  </option>
                  <option value="symbol-asc" className="bg-[#101a2b] text-[#f1f5f9]">
                    Symbol (A-Z)
                  </option>
                  <option value="risk-desc" className="bg-[#101a2b] text-[#f1f5f9]">
                    Risk Score
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Color-Coded Heatmap Grid Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {sortedItems.map((item) => {
              const pct = parsePercent(item.change);
              const color = getHeatmapColor(pct);
              const isActive = item.symbol === activeStockSymbol;

              return (
                <div
                  key={item.symbol}
                  onClick={() => onSelectStock(item.symbol)}
                  onMouseEnter={() => setHoveredTile(item.symbol)}
                  onMouseLeave={() => setHoveredTile(null)}
                  className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group select-none ${
                    color.bg
                  } ${color.hoverBg} ${color.border} ${
                    isActive
                      ? 'ring-2 ring-[#22d3ee] ring-offset-2 ring-offset-[#070d19] shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                      : 'hover:scale-[1.02] hover:shadow-lg'
                  }`}
                  style={{ minHeight: '116px' }}
                >
                  {/* Top Header inside tile: Symbol & Exchange */}
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] font-bold font-mono tracking-tight text-white drop-shadow-sm">
                        {item.symbol}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold ${color.badgeBg} ${color.badgeText}`}
                      >
                        {item.exchange}
                      </span>
                    </div>

                    {isActive ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#22d3ee] text-[#083344] font-extrabold uppercase shadow-sm">
                        Active
                      </span>
                    ) : (
                      <span className="text-[14px] opacity-80 group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </span>
                    )}
                  </div>

                  {/* Company Name Subtext */}
                  <div className={`text-[11px] truncate font-sans font-medium ${color.subtext}`}>
                    {item.name}
                  </div>

                  {/* Center/Bottom Highlight: Percentage Change + Price */}
                  <div className="mt-1 flex items-baseline justify-between">
                    <div className="flex items-center gap-1">
                      {pct >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-white drop-shadow stroke-[2.5]" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-white drop-shadow stroke-[2.5]" />
                      )}
                      <span className="text-[18px] sm:text-[19px] font-black font-mono tracking-tight text-white drop-shadow">
                        {item.change}
                      </span>
                    </div>

                    <span className={`text-[12px] font-mono font-bold ${color.subtext}`}>
                      {item.price}
                    </span>
                  </div>

                  {/* Bottom micro-bar: ML direction & quick action */}
                  <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/90">
                    <span className="truncate max-w-[95px] opacity-90">{item.mlDirection}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStockAndTab(item.symbol, 'dashboard');
                      }}
                      className="px-1.5 py-0.5 rounded bg-black/30 hover:bg-black/50 text-white font-semibold flex items-center gap-0.5 opacity-90 group-hover:opacity-100 transition-opacity"
                      title="Analyze in Dashboard"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Color Scale Heatmap Legend */}
          <div className="mt-2 pt-2.5 border-t border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] font-mono text-[#94a3b8]">
            <span className="font-semibold text-[#f1f5f9] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
              Heatmap Scale Legend:
            </span>

            {/* Gradient scale strips */}
            <div className="flex items-center gap-1 flex-wrap">
              <div className="flex items-center gap-1 bg-[#070d19] px-2 py-1 rounded-md border border-[#1e293b]">
                <div className="w-3 h-3 rounded bg-red-700 border border-red-500/50" />
                <span>&lt; -3.0%</span>
              </div>
              <div className="flex items-center gap-1 bg-[#070d19] px-2 py-1 rounded-md border border-[#1e293b]">
                <div className="w-3 h-3 rounded bg-rose-700 border border-rose-500/50" />
                <span>-1.5% to -3%</span>
              </div>
              <div className="flex items-center gap-1 bg-[#070d19] px-2 py-1 rounded-md border border-[#1e293b]">
                <div className="w-3 h-3 rounded bg-rose-950 border border-rose-800/50" />
                <span>-0.1% to -1.5%</span>
              </div>
              <div className="flex items-center gap-1 bg-[#070d19] px-2 py-1 rounded-md border border-[#1e293b]">
                <div className="w-3 h-3 rounded bg-[#1e293b] border border-slate-700" />
                <span>0.0% Flat</span>
              </div>
              <div className="flex items-center gap-1 bg-[#070d19] px-2 py-1 rounded-md border border-[#1e293b]">
                <div className="w-3 h-3 rounded bg-emerald-900 border border-emerald-700/50" />
                <span>+0.1% to +1.5%</span>
              </div>
              <div className="flex items-center gap-1 bg-[#070d19] px-2 py-1 rounded-md border border-[#1e293b]">
                <div className="w-3 h-3 rounded bg-emerald-700 border border-emerald-500/50" />
                <span>+1.5% to +3%</span>
              </div>
              <div className="flex items-center gap-1 bg-[#070d19] px-2 py-1 rounded-md border border-[#1e293b]">
                <div className="w-3 h-3 rounded bg-emerald-600 border border-emerald-400/50" />
                <span>&gt; +3.0%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar (shown for cards view or split view) */}
      {(viewMode === 'split' || viewMode === 'cards') && (
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter watchlist cards by symbol or company name..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#101a2b] border border-[#1e293b] focus:border-[#22d3ee] rounded-xl text-[13px] font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none transition-colors"
          />
        </div>
      )}

      {/* DETAILED CARDS GRID (shown in 'split' or 'cards' mode) */}
      {(viewMode === 'split' || viewMode === 'cards') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedItems.map((item) => {
            const isSelected = item.symbol === activeStockSymbol;

            return (
              <div
                key={item.symbol}
                className={`bg-[#101a2b] hover:bg-[#16243c] p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-[#22d3ee]/40 bg-gradient-to-b from-[#101a2b] to-[#13233a] shadow-[0_0_15px_rgba(34,211,238,0.06)]'
                    : 'border-[#1e293b]'
                }`}
              >
                {/* Top Row: Symbol, Exchange, Price, & Remove */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[20px]">{item.emoji}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[15px] text-[#f1f5f9] font-mono">
                          {item.symbol}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#16243c] text-[#94a3b8] border border-[#1e293b]">
                          {item.exchange}
                        </span>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#22d3ee]/15 text-[#22d3ee] font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] text-[#94a3b8] font-sans truncate block max-w-[180px]">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="font-mono text-[14px] font-bold text-[#f1f5f9] block">
                        {item.price}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                          item.isPositive
                            ? 'text-[#34d399] bg-[#10b981]/10'
                            : 'text-[#f87171] bg-[#ef4444]/10'
                        }`}
                      >
                        {item.change}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.symbol);
                      }}
                      title="Remove from watchlist"
                      className="p-1.5 rounded-lg text-[#64748b] hover:text-[#f87171] hover:bg-[#1e293b] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Middle Row: ML Direction & Risk Vector */}
                <div className="grid grid-cols-2 gap-2 bg-[#070d19] p-2.5 rounded-lg border border-[#1e293b] font-mono text-[11px]">
                  <div>
                    <span className="text-[#64748b] block text-[10px]">ML FORECAST</span>
                    <span
                      className={`font-semibold ${
                        item.mlDirection.includes('Bullish')
                          ? 'text-[#34d399]'
                          : item.mlDirection.includes('Bearish')
                          ? 'text-[#f87171]'
                          : 'text-[#c4b5fd]'
                      }`}
                    >
                      {item.mlDirection}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[10px]">RISK VECTOR</span>
                    <span className="text-[#f59e0b] font-semibold">{item.riskVector}</span>
                  </div>
                </div>

                {/* Bottom Row: XAI Signal & Jump To Analysis */}
                <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                  <div className="flex items-center gap-1 text-[#94a3b8] truncate max-w-[200px]">
                    <Zap className="w-3.5 h-3.5 text-[#22d3ee] shrink-0" />
                    <span className="truncate">{item.xaiSignal}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectStock(item.symbol)}
                      className="px-2.5 py-1 rounded-lg bg-[#16243c] hover:bg-[#1e3a5f] text-[#f1f5f9] transition-colors"
                    >
                      Set Active
                    </button>
                    <button
                      onClick={() => onSelectStockAndTab(item.symbol, 'dashboard')}
                      className="px-2.5 py-1 rounded-lg bg-[#22d3ee]/15 hover:bg-[#22d3ee]/25 text-[#22d3ee] border border-[#22d3ee]/40 flex items-center gap-1 font-semibold transition-colors"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sortedItems.length === 0 && (
        <div className="bg-[#101a2b] p-8 rounded-2xl border border-[#1e293b] text-center space-y-2">
          <Bookmark className="w-8 h-8 text-[#64748b] mx-auto" />
          <p className="text-[14px] text-[#f1f5f9] font-medium">No matching stocks found</p>
          <p className="text-[12px] text-[#94a3b8] font-mono">
            Adjust your filter criteria or click "Add Stock" above to include new tickers.
          </p>
        </div>
      )}

      {/* Add Stock Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101a2b] border border-[#1e3a5f] rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#f1f5f9]">Add Stock to Watchlist</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#94a3b8] hover:text-[#f1f5f9]"
              >
                ✕
              </button>
            </div>

            <p className="text-[12px] text-[#94a3b8] font-mono">
              Enter symbol from NSE, BSE, or NASDAQ (e.g. RELIANCE, SBIN, MSFT, GOOGL):
            </p>

            <input
              type="text"
              value={newSymbolInput}
              onChange={(e) => setNewSymbolInput(e.target.value)}
              placeholder="Enter ticker (e.g. INFY)..."
              className="w-full px-3 py-2 bg-[#070d19] border border-[#1e293b] focus:border-[#22d3ee] rounded-xl text-[13px] font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
              autoFocus
            />

            {/* Quick Suggestions */}
            <div>
              <span className="text-[10px] font-mono text-[#64748b] block mb-1">
                POPULAR TICKERS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['TCS', 'RELIANCE', 'INFY', 'AAPL', 'MSFT', 'NVDA', 'TSLA', 'SBIN', 'ICICIBANK'].map(
                  (sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleAddStock(sym)}
                      className="px-2 py-0.5 rounded bg-[#16243c] hover:bg-[#1e3a5f] text-[#22d3ee] text-[11px] font-mono border border-[#1e293b]"
                    >
                      +{sym}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e293b]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-[#16243c] text-[#94a3b8] text-[12px] font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddStock(newSymbolInput)}
                className="px-3 py-1.5 rounded-lg bg-[#22d3ee] text-[#083344] text-[12px] font-mono font-bold"
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistScreen;
