import React, { useState } from 'react';
import { CORE_HOLDINGS, WATCHLIST_ITEMS } from '../../data/stocksData';
import { WatchlistItem } from '../../types/stock';

interface TerminalHubScreenProps {
  onSelectStockAndTab: (symbol: string, tab: 'dashboard' | 'predictions' | 'risk-matrix' | 'xai-explainability') => void;
  onOpenMonteCarlo: () => void;
  onOpenExportDossier: () => void;
}

export const TerminalHubScreen: React.FC<TerminalHubScreenProps> = ({
  onSelectStockAndTab,
  onOpenMonteCarlo,
  onOpenExportDossier,
}) => {
  const [activeSegment, setActiveSegment] = useState<'portfolio' | 'watchlist'>('portfolio');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(WATCHLIST_ITEMS);
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newExchange, setNewExchange] = useState('NSE');
  const [alertDismissed, setAlertDismissed] = useState(false);

  const filteredWatchlist = watchlist.filter(
    (w) =>
      w.symbol.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAddStock = () => {
    if (!newSymbol.trim()) return;
    const item: WatchlistItem = {
      symbol: newSymbol.toUpperCase().trim(),
      name: newName.trim() || newSymbol.toUpperCase().trim(),
      exchange: newExchange,
      emoji: '📈',
      price: '₹2,450.00',
      change: '+1.05%',
      isPositive: true,
      mlDirection: 'Bullish 72%',
      riskVector: 'Med 48',
      xaiSignal: 'Mean Reversion Target',
      attention: 'Quarterly Volume Momentum',
    };
    setWatchlist((prev) => [item, ...prev]);
    setNewSymbol('');
    setNewName('');
    setShowAddStockModal(false);
  };

  return (
    <div className="flex flex-col w-full pb-6 space-y-3 animate-fadeIn">
      {/* Interactive View Segment Tabs */}
      <div className="flex items-center justify-between bg-[#0a0e18] p-1 rounded-xl shadow-inner border border-[#262a35]/60">
        <button
          onClick={() => setActiveSegment('portfolio')}
          className={`flex-1 py-2 px-3 rounded-lg font-sans text-[13px] transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'portfolio'
              ? 'bg-[#262a35] text-[#dfe2f1] font-semibold shadow-sm'
              : 'text-[#c7c4d7] hover:text-[#dfe2f1]'
          }`}
          id="tab-portfolio"
        >
          <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">pie_chart</span>
          <span>Portfolio</span>
          <span className="font-mono text-[10px] text-[#4cd7f6] bg-[#313540]/80 px-1.5 py-0.5 rounded ml-1">
            ₹4.82L
          </span>
        </button>

        <button
          onClick={() => setActiveSegment('watchlist')}
          className={`flex-1 py-2 px-3 rounded-lg font-sans text-[13px] transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'watchlist'
              ? 'bg-[#262a35] text-[#dfe2f1] font-semibold shadow-sm'
              : 'text-[#c7c4d7] hover:text-[#dfe2f1]'
          }`}
          id="tab-watchlist"
        >
          <span className="material-symbols-outlined text-[18px]">bookmark</span>
          <span>Watchlist</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#171b26] text-[#c7c4d7] ml-1">
            {watchlist.length}
          </span>
        </button>
      </div>

      {/* PORTFOLIO VIEW */}
      {activeSegment === 'portfolio' && (
        <div className="flex flex-col space-y-3 animate-fadeIn">
          {/* Macro Valuation & Telemetry Card */}
          <div className="bg-[#1c1f2a] rounded-xl p-3.5 flex flex-col space-y-3 relative overflow-hidden shadow-sm border border-[#262a35]/60">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-[#c7c4d7]">
                    Aggregate Net Liquidation
                  </span>
                  <span
                    className="material-symbols-outlined text-[14px] text-[#c0c1ff]"
                    title="Real-time XAI Aggregated Feed"
                  >
                    verified
                  </span>
                </div>
                <div className="font-mono text-[24px] font-bold text-[#dfe2f1] mt-1 tracking-tight">
                  ₹4,82,450.00
                </div>
              </div>
              <div className="flex flex-col items-end font-mono">
                <div className="flex items-center gap-1 bg-[#0a0e18] px-2 py-1 rounded text-[#4cd7f6] text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  <span>+12.66%</span>
                </div>
                <span className="text-[10px] text-[#c7c4d7] mt-1">+₹54,230.80 Total</span>
              </div>
            </div>

            {/* Quick Session Returns Ticker */}
            <div className="flex items-center justify-between bg-[#171b26] p-2 rounded-lg font-mono text-[12px]">
              <span className="text-[#c7c4d7] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                Day P&amp;L (Intraday Alpha)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#4cd7f6] font-medium">+₹3,410.20</span>
                <span className="bg-[#313540] text-[#4cd7f6] text-[10px] px-1.5 py-0.5 rounded">
                  +0.71%
                </span>
              </div>
            </div>

            {/* Quantitative Health Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
              {/* Metric 1: Risk Arc */}
              <div className="bg-[#171b26] p-2.5 rounded-lg flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] uppercase text-[#c7c4d7]">
                    Portfolio Risk
                  </span>
                  <span className="text-[16px] font-bold text-[#dfe2f1] mt-0.5">
                    54<span className="text-[11px] text-[#c7c4d7] font-normal">/100</span>
                  </span>
                  <span className="text-[10px] text-[#4cd7f6] mt-0.5">Moderate Var</span>
                </div>
                <div className="relative w-11 h-11 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#313540]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    ></path>
                    <path
                      className="text-[#4cd7f6]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="54, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    ></path>
                  </svg>
                  <span className="material-symbols-outlined text-[16px] text-[#4cd7f6] absolute">
                    speed
                  </span>
                </div>
              </div>

              {/* Metric 2: Diversification */}
              <div className="bg-[#171b26] p-2.5 rounded-lg flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] uppercase text-[#c7c4d7]">
                    Diversification
                  </span>
                  <span className="text-[16px] font-bold text-[#dfe2f1] mt-0.5">78%</span>
                  <span className="text-[10px] text-[#c0c1ff] mt-0.5">Optimal Spread</span>
                </div>
                <div className="relative w-11 h-11 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#313540]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    ></path>
                    <path
                      className="text-[#c0c1ff]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="78, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    ></path>
                  </svg>
                  <span className="material-symbols-outlined text-[16px] text-[#c0c1ff] absolute">
                    donut_small
                  </span>
                </div>
              </div>

              {/* Metric 3: Portfolio Beta */}
              <div className="bg-[#171b26] p-2.5 rounded-lg flex flex-col justify-between">
                <span className="font-sans text-[10px] uppercase text-[#c7c4d7]">
                  Market Beta (β)
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-[16px] font-bold text-[#dfe2f1]">0.92</span>
                  <span className="font-sans text-[10px] px-1.5 py-0.5 rounded bg-[#262a35] text-[#dfe2f1]">
                    Defensive
                  </span>
                </div>
                <div className="w-full bg-[#313540] h-1 rounded mt-2 overflow-hidden">
                  <div className="bg-[#4cd7f6] h-full rounded" style={{ width: '46%' }}></div>
                </div>
              </div>

              {/* Metric 4: Sharpe Ratio */}
              <div className="bg-[#171b26] p-2.5 rounded-lg flex flex-col justify-between">
                <span className="font-sans text-[10px] uppercase text-[#c7c4d7]">
                  Sharpe Ratio
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-[16px] font-bold text-[#dfe2f1]">1.82</span>
                  <span className="font-sans text-[10px] px-1.5 py-0.5 rounded bg-[#262a35] text-[#c0c1ff]">
                    Top 12%
                  </span>
                </div>
                <div className="w-full bg-[#313540] h-1 rounded mt-2 overflow-hidden">
                  <div className="bg-[#c0c1ff] h-full rounded" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Advisory Insight (XAI Synthesis) */}
          {!alertDismissed && (
            <div className="bg-[#171b26] rounded-xl p-3.5 flex flex-col space-y-2 relative overflow-hidden shadow-sm border border-[#262a35]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#c0c1ff] animate-pulse">
                    psychology
                  </span>
                  <span className="font-sans text-[13px] font-semibold text-[#c0c1ff]">
                    Gemini Quantitative Sentinel
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-[#c7c4d7] bg-[#262a35] px-1.5 py-0.5 rounded">
                    SHAP Conf 94%
                  </span>
                  <button
                    onClick={() => setAlertDismissed(true)}
                    className="text-[#908fa0] hover:text-[#dfe2f1]"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
              <p className="font-sans text-[13px] text-[#dfe2f1] leading-relaxed">
                <strong className="text-[#d0bcff]">Sector Alert:</strong> Tech weighting stands at{' '}
                <span className="font-mono text-[#4cd7f6] font-semibold">42.0%</span>. Asymmetric risk model recommends trimming to defensive FMCG/Pharma to dampen beta ahead of US FOMC rate statement.
              </p>
              <div className="flex items-center justify-between pt-1 font-mono text-[11px] text-[#c7c4d7]">
                <span>Suggested action: Rebalance ₹32,000 into Nifty Defensive ETF</span>
                <button
                  onClick={onOpenMonteCarlo}
                  className="text-[#4cd7f6] flex items-center hover:underline"
                >
                  Inspect <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {/* Portfolio Holdings Section */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-[15px] font-semibold text-[#dfe2f1]">
                  Core Holdings
                </span>
                <span className="font-mono text-[10px] text-[#c7c4d7] bg-[#262a35] px-1.5 py-0.5 rounded">
                  {CORE_HOLDINGS.length} Assets
                </span>
              </div>
              <button className="text-[#c7c4d7] hover:text-[#dfe2f1] flex items-center gap-0.5 font-sans text-[11px]">
                <span>Sort: Value</span>
                <span className="material-symbols-outlined text-[16px]">swap_vert</span>
              </button>
            </div>

            {/* Holdings Cards */}
            {CORE_HOLDINGS.map((item) => (
              <div
                key={item.symbol}
                className="bg-[#1c1f2a] rounded-xl p-3.5 flex flex-col space-y-2.5 transition-all border border-[#262a35]/60 hover:border-[#4cd7f6]/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-[15px] font-semibold text-[#dfe2f1]">
                        {item.symbol}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#262a35] text-[#c7c4d7]">
                        {item.exchange}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                          item.direction === 'BULLISH'
                            ? 'text-[#4cd7f6] bg-[#0a0e18]'
                            : 'text-[#d0bcff] bg-[#0a0e18]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {item.direction === 'BULLISH' ? 'trending_up' : 'balance'}
                        </span>{' '}
                        {item.direction} {item.directionProb}%
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#c7c4d7]">
                      {item.name} · Qty: {item.qty}
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[14px] font-bold text-[#dfe2f1]">
                      {item.curPriceFormatted}
                    </div>
                    <div
                      className={`text-[11px] ${
                        item.pnlPercent >= 0 ? 'text-[#4cd7f6]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      {item.pnlFormatted}
                    </div>
                  </div>
                </div>

                {/* Sub metrics */}
                <div className="grid grid-cols-3 gap-2 bg-[#171b26] p-2 rounded-lg font-mono text-[11px] text-[#c7c4d7]">
                  <div>
                    <span className="block text-[#908fa0] text-[10px]">Avg Buy</span>
                    <span className="text-[#dfe2f1] font-medium">{item.avgBuyFormatted}</span>
                  </div>
                  <div>
                    <span className="block text-[#908fa0] text-[10px]">Cur Value</span>
                    <span className="text-[#dfe2f1] font-medium">{item.curValueFormatted}</span>
                  </div>
                  <div>
                    <span className="block text-[#908fa0] text-[10px]">Risk Vector</span>
                    <span
                      className={`font-medium ${
                        item.riskVectorColor === 'Low'
                          ? 'text-[#4cd7f6]'
                          : item.riskVectorColor === 'Med'
                          ? 'text-[#d0bcff]'
                          : 'text-[#ffb4ab]'
                      }`}
                    >
                      {item.riskVector}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[#c7c4d7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                    <span>SHAP Driver: {item.shapDriver}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectStockAndTab(item.symbol, 'xai-explainability')}
                      className="bg-[#262a35] hover:bg-[#313540] text-[#dfe2f1] px-2.5 py-1 rounded text-[11px] font-sans flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px] text-[#c0c1ff]">
                        auto_awesome
                      </span>{' '}
                      Explain
                    </button>
                    <button
                      onClick={() => onSelectStockAndTab(item.symbol, 'dashboard')}
                      className="bg-[#171b26] hover:bg-[#262a35] text-[#c7c4d7] hover:text-[#dfe2f1] p-1 rounded"
                      title="Inspect in Dashboard"
                    >
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WATCHLIST VIEW */}
      {activeSegment === 'watchlist' && (
        <div className="flex flex-col space-y-3 animate-fadeIn">
          {/* Header & Add Button */}
          <div className="bg-[#1c1f2a] rounded-xl p-3.5 flex flex-col space-y-2.5 border border-[#262a35]/60 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-sans text-[15px] font-semibold text-[#dfe2f1]">
                  Target Watchlist
                </span>
                <p className="font-mono text-[11px] text-[#c7c4d7]">
                  {watchlist.length} symbols tracked with neural inference
                </p>
              </div>
              <button
                onClick={() => setShowAddStockModal(true)}
                className="bg-[#c0c1ff] text-[#1000a9] font-sans text-[12px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">add</span> Add Stock
              </button>
            </div>

            {/* Quick search input */}
            <div className="flex items-center gap-2 bg-[#0a0e18] px-3 py-2 rounded-lg border border-[#262a35]/60">
              <span className="material-symbols-outlined text-[#908fa0] text-[18px]">search</span>
              <input
                className="bg-transparent border-0 outline-none w-full font-mono text-[12px] text-[#dfe2f1] placeholder-[#908fa0]"
                placeholder="Search by ticker or sector (e.g. MSFT, Energy)..."
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              <span className="material-symbols-outlined text-[#908fa0] text-[18px]">tune</span>
            </div>
          </div>

          {/* Watchlist cards */}
          <div className="flex flex-col space-y-2.5">
            {filteredWatchlist.map((item) => (
              <div
                key={item.symbol}
                className="bg-[#1c1f2a] rounded-xl p-3.5 flex flex-col space-y-2 border border-[#262a35]/60 hover:border-[#4cd7f6]/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#262a35] flex items-center justify-center text-[18px]">
                      {item.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans text-[15px] font-semibold text-[#dfe2f1]">
                          {item.symbol}
                        </span>
                        <span className="font-mono text-[10px] px-1 rounded bg-[#262a35] text-[#c7c4d7]">
                          {item.exchange}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#c7c4d7]">{item.name}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[14px] font-bold text-[#dfe2f1]">{item.price}</div>
                    <span
                      className={`text-[10px] px-1 rounded inline-block mt-0.5 ${
                        item.isPositive
                          ? 'text-[#4cd7f6] bg-[#171b26]'
                          : 'text-[#ffb4ab] bg-[#171b26]'
                      }`}
                    >
                      {item.change}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#171b26] p-2 rounded-lg font-mono text-[11px]">
                  <div>
                    <span className="block text-[#908fa0] text-[10px]">ML Direction</span>
                    <span
                      className={`font-medium ${
                        item.isPositive ? 'text-[#4cd7f6]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      {item.mlDirection}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#908fa0] text-[10px]">Risk Vector</span>
                    <span
                      className={`font-medium ${
                        item.isPositive ? 'text-[#4cd7f6]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      {item.riskVector}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#908fa0] text-[10px]">XAI Signal</span>
                    <span className="text-[#dfe2f1] font-medium truncate block">
                      {item.xaiSignal}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="text-[#c7c4d7] font-mono text-[10px]">
                    Attention: {item.attention}
                  </span>
                  <button
                    onClick={() => onSelectStockAndTab(item.symbol, 'dashboard')}
                    className="text-[#c0c1ff] hover:text-[#dfe2f1] flex items-center gap-0.5 font-sans font-medium"
                  >
                    Deep Dive <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Quantitative Intelligence Operations Bar */}
      <div className="bg-[#171b26] rounded-xl p-3.5 flex flex-col space-y-2 shadow-sm border border-[#262a35]/60">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#c7c4d7] font-semibold">
            Institutional Stress Tools
          </span>
          <span className="font-mono text-[11px] text-[#c0c1ff] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff] animate-pulse"></span>
            Ready
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenMonteCarlo}
            className="bg-[#262a35] hover:bg-[#313540] text-[#dfe2f1] p-2.5 rounded-lg flex flex-col items-start space-y-1 text-left active:scale-[0.98] transition-transform border border-[#313540]"
          >
            <div className="flex items-center gap-1.5 text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[18px]">casino</span>
              <span className="font-sans text-[13px] font-semibold">Monte Carlo</span>
            </div>
            <span className="font-mono text-[11px] text-[#c7c4d7] line-clamp-1">
              10k Path Stress Test
            </span>
          </button>

          <button
            onClick={onOpenExportDossier}
            className="bg-[#262a35] hover:bg-[#313540] text-[#dfe2f1] p-2.5 rounded-lg flex flex-col items-start space-y-1 text-left active:scale-[0.98] transition-transform border border-[#313540]"
          >
            <div className="flex items-center gap-1.5 text-[#c0c1ff]">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span className="font-sans text-[13px] font-semibold">Export Dossier</span>
            </div>
            <span className="font-mono text-[11px] text-[#c7c4d7] line-clamp-1">
              AI Audit Report
            </span>
          </button>
        </div>
      </div>

      {/* Academic / Viva AI Disclaimer Banner */}
      <div className="bg-[#0a0e18] p-3.5 rounded-xl flex items-start gap-2.5 text-[#c7c4d7] shadow-inner border border-[#262a35]/60">
        <span className="material-symbols-outlined text-[20px] text-[#d0bcff] shrink-0 mt-0.5">
          verified_user
        </span>
        <div className="flex flex-col space-y-1">
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[#dfe2f1]">
            Algorithmic Advisory Disclaimer
          </span>
          <p className="font-mono text-[11px] leading-relaxed text-[#908fa0]">
            Neural predictions, SHAP attribution coefficients, and stress outcomes are computed via probabilistic machine learning estimators. This tool operates as computational decision support and does not constitute guaranteed equity advice.
          </p>
        </div>
      </div>

      {/* Modal: Add Stock */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl w-full max-w-sm p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#262a35]">
              <span className="font-sans text-[14px] font-semibold text-[#dfe2f1]">
                Add Stock to Watchlist
              </span>
              <button
                onClick={() => setShowAddStockModal(false)}
                className="text-[#c7c4d7] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-2 font-mono text-[12px]">
              <div>
                <label className="text-[#908fa0] text-[10px] block mb-1">Ticker Symbol</label>
                <input
                  type="text"
                  placeholder="e.g. MSFT, GOOG, SBIN"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-full bg-[#0a0e18] rounded p-2 text-[#dfe2f1] border border-[#262a35] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#908fa0] text-[10px] block mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Microsoft Corp."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#0a0e18] rounded p-2 text-[#dfe2f1] border border-[#262a35] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#908fa0] text-[10px] block mb-1">Exchange</label>
                <select
                  value={newExchange}
                  onChange={(e) => setNewExchange(e.target.value)}
                  className="w-full bg-[#0a0e18] rounded p-2 text-[#dfe2f1] border border-[#262a35] focus:outline-none"
                >
                  <option value="NSE">NSE (India)</option>
                  <option value="NASDAQ">NASDAQ (US)</option>
                  <option value="NYSE">NYSE (US)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddStockModal(false)}
                className="px-3 py-1.5 rounded bg-[#262a35] text-[#c7c4d7] text-[12px]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStock}
                className="px-4 py-1.5 rounded bg-[#4cd7f6] text-[#003640] font-semibold text-[12px]"
              >
                Add Symbol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
