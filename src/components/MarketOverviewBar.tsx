import React, { useState, useEffect } from 'react';
import { StockData } from '../types/stock';
import {
  INITIAL_MARKET_INDICES,
  getSelectedStockOverviewItem,
  MarketOverviewItem,
} from '../data/marketIndicesData';
import { TrendingUp, TrendingDown, Clock, ShieldCheck, Activity } from 'lucide-react';

interface MarketOverviewBarProps {
  activeStock: StockData;
  isLive?: boolean;
  onSelectIndexStock?: (symbol: string) => void;
}

export const MarketOverviewBar: React.FC<MarketOverviewBarProps> = ({
  activeStock,
  isLive = true,
  onSelectIndexStock,
}) => {
  const [indices, setIndices] = useState<MarketOverviewItem[]>(INITIAL_MARKET_INDICES);
  const [lastTickId, setLastTickId] = useState<string | null>(null);

  // Micro jitter for live streaming simulation when live mode is turned on
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Pick random index to update
      const targetIdx = Math.floor(Math.random() * indices.length);
      const targetItem = indices[targetIdx];

      // Only update open markets (e.g. NSE / BSE during market hours)
      if (targetItem.marketStatus === 'OPEN') {
        const jitter = (Math.random() - 0.48) * 4.5;
        const newNumericVal = targetItem.numericValue + jitter;
        const newNumericChange = targetItem.numericChange + jitter;
        const newPct = (newNumericChange / (newNumericVal - newNumericChange)) * 100;
        const isPos = newNumericChange >= 0;

        setIndices((prev) =>
          prev.map((item, idx) => {
            if (idx === targetIdx) {
              return {
                ...item,
                value: newNumericVal.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
                numericValue: newNumericVal,
                change: `${isPos ? '+' : ''}${newNumericChange.toFixed(2)}`,
                changePercent: `${isPos ? '+' : ''}${newPct.toFixed(2)}%`,
                numericChange: newNumericChange,
                isPositive: isPos,
                lastUpdated: 'Just now',
              };
            }
            return item;
          })
        );

        setLastTickId(targetItem.id);
        setTimeout(() => setLastTickId(null), 800);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive, indices]);

  const selectedStockItem = getSelectedStockOverviewItem(activeStock);
  const allWidgets = [...indices, selectedStockItem];

  return (
    <section aria-label="Market Overview" className="w-full mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {allWidgets.map((item) => {
          const isTicking = lastTickId === item.id;
          const isSelected = item.isCustomStock;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (!item.isCustomStock && onSelectIndexStock) {
                  // If it corresponds to a tradeable benchmark or ticker
                  if (item.symbol === 'NIFTY') onSelectIndexStock('TCS');
                  if (item.symbol === 'IXIC') onSelectIndexStock('AAPL');
                }
              }}
              className={`relative bg-[#101a2b] hover:bg-[#16243c] p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-[#22d3ee]/40 shadow-[0_0_12px_rgba(34,211,238,0.08)] bg-gradient-to-b from-[#101a2b] to-[#122238]'
                  : 'border-[#1e293b] hover:border-[#1e3a5f]'
              } ${isTicking ? 'ring-1 ring-[#22d3ee]' : ''}`}
            >
              {/* Header row: Name & Market Status */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-[13px] text-[#f1f5f9] tracking-tight truncate">
                    {item.name}
                  </span>
                  {isSelected && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30 shrink-0">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                      item.marketStatus === 'OPEN'
                        ? 'bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30'
                        : 'bg-[#64748b]/15 text-[#94a3b8] border border-[#64748b]/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.marketStatus === 'OPEN'
                          ? 'bg-[#10b981] animate-pulse'
                          : 'bg-[#64748b]'
                      }`}
                    />
                    {item.marketStatus}
                  </span>
                </div>
              </div>

              {/* Value and Change row */}
              <div className="flex items-baseline justify-between gap-1">
                <span className="font-mono text-[16px] sm:text-[18px] font-bold text-[#f1f5f9] tracking-tight">
                  {item.value}
                </span>

                <div
                  className={`flex items-center gap-0.5 font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                    item.isPositive
                      ? 'text-[#10b981] bg-[#10b981]/10'
                      : 'text-[#ef4444] bg-[#ef4444]/10'
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp className="w-3 h-3 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3 h-3 shrink-0" />
                  )}
                  <span>{item.changePercent}</span>
                </div>
              </div>

              {/* Absolute change and source footer */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8] mt-1.5 pt-1.5 border-t border-[#1e293b]/70">
                <span className={item.isPositive ? 'text-[#34d399]' : 'text-[#f87171]'}>
                  {item.change}
                </span>
                <span className="truncate max-w-[100px] text-right" title={`${item.source} • ${item.lastUpdated}`}>
                  {item.source}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MarketOverviewBar;
