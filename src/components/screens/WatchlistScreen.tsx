import React, { useState } from 'react';
import { StockData, WatchlistItem } from '../../types/stock';
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
} from 'lucide-react';

interface WatchlistScreenProps {
  onSelectStockAndTab: (symbol: string, tab: 'dashboard' | 'predictions' | 'risk-matrix' | 'xai-explainability') => void;
  onSelectStock: (symbol: string) => void;
  activeStockSymbol: string;
}

export const WatchlistScreen: React.FC<WatchlistScreenProps> = ({
  onSelectStockAndTab,
  onSelectStock,
  activeStockSymbol,
}) => {
  const [items, setItems] = useState<WatchlistItem[]>(WATCHLIST_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSymbolInput, setNewSymbolInput] = useState('');

  const filteredItems = items.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Header with Title & Add Stock Button */}
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
          </div>
          <p className="text-[12px] font-mono text-[#94a3b8] mt-1">
            Real-time multi-asset observation list with ML direction &amp; XAI signals
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#38bdf8] text-[#083344] font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter watchlist by symbol or company name..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#101a2b] border border-[#1e293b] focus:border-[#22d3ee] rounded-xl text-[13px] font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none transition-colors"
        />
      </div>

      {/* Watchlist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
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

      {filteredItems.length === 0 && (
        <div className="bg-[#101a2b] p-8 rounded-2xl border border-[#1e293b] text-center space-y-2">
          <Bookmark className="w-8 h-8 text-[#64748b] mx-auto" />
          <p className="text-[14px] text-[#f1f5f9] font-medium">No stocks in watchlist</p>
          <p className="text-[12px] text-[#94a3b8] font-mono">
            Add tickers from the top search bar or click "Add Stock" above.
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

            <div className="flex items-center justify-end gap-2">
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
