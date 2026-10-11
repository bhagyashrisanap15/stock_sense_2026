import React, { useState } from 'react';
import { PortfolioHolding } from '../../types/stock';
import { CORE_HOLDINGS } from '../../data/stocksData';
import { DividendAnalysisWidget } from '../DividendAnalysisWidget';
import {
  Briefcase,
  PieChart,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  FileText,
  DollarSign,
  Download,
  Coins,
} from 'lucide-react';

interface PortfolioScreenProps {
  onSelectStockAndTab: (symbol: string, tab: 'dashboard' | 'predictions' | 'risk-matrix' | 'xai-explainability') => void;
  onOpenExportDossier?: () => void;
  onOpenMonteCarlo?: () => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  onSelectStockAndTab,
  onOpenExportDossier,
  onOpenMonteCarlo,
}) => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(CORE_HOLDINGS);

  // Compute portfolio aggregate metrics
  const totalValue = holdings.reduce((acc, h) => acc + h.curValue, 0);
  const totalCost = holdings.reduce((acc, h) => acc + h.avgBuy * h.qty, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = (totalPnl / totalCost) * 100;

  return (
    <div className="flex flex-col w-full space-y-4 animate-fadeIn">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101a2b] p-4 rounded-2xl border border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-[18px] font-bold text-[#f1f5f9] tracking-tight">
              Institutional Portfolio Analytics
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#16243c] text-[#22d3ee] border border-[#22d3ee]/30 font-semibold">
              {holdings.length} Positions
            </span>
          </div>
          <p className="text-[12px] font-mono text-[#94a3b8] mt-1">
            Aggregated exposure, unrealized P&amp;L, factor weights, and systemic tail risks
          </p>
        </div>

        {onOpenExportDossier && (
          <button
            onClick={onOpenExportDossier}
            className="px-3.5 py-2 rounded-xl bg-[#16243c] hover:bg-[#1e3a5f] text-[#22d3ee] border border-[#22d3ee]/30 font-semibold text-[12px] font-mono flex items-center justify-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export AI Dossier</span>
          </button>
        )}
      </div>

      {/* Aggregate Overview Card */}
      <div className="bg-[#101a2b] p-4 lg:p-5 rounded-2xl border border-[#1e293b] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Liquidation */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-1">
          <span className="text-[11px] font-mono uppercase text-[#94a3b8]">Net Portfolio Value</span>
          <div className="font-mono text-[22px] font-bold text-[#f1f5f9]">
            ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] font-mono text-[#64748b]">Real-time Mark-to-Market</span>
        </div>

        {/* Unrealized P&L */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-1">
          <span className="text-[11px] font-mono uppercase text-[#94a3b8]">Unrealized P&amp;L</span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-[22px] font-bold text-[#34d399]">
              +₹{totalPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[12px] font-semibold text-[#34d399] px-1.5 py-0.2 rounded bg-[#10b981]/15">
              +{totalPnlPercent.toFixed(2)}%
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#64748b]">Total return across open holdings</span>
        </div>

        {/* Portfolio Beta */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-1">
          <span className="text-[11px] font-mono uppercase text-[#94a3b8]">Weighted Beta</span>
          <div className="font-mono text-[22px] font-bold text-[#22d3ee]">0.91</div>
          <span className="text-[10px] font-mono text-[#64748b]">Defensive vs NIFTY benchmark</span>
        </div>

        {/* Portfolio VaR 95% */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-1">
          <span className="text-[11px] font-mono uppercase text-[#94a3b8]">Portfolio VaR (95%)</span>
          <div className="font-mono text-[22px] font-bold text-[#f87171]">-1.98%</div>
          <span className="text-[10px] font-mono text-[#64748b]">Max 1-day adverse loss bound</span>
        </div>
      </div>

      {/* Asset Allocation Breakdown Bar */}
      <div className="bg-[#101a2b] p-4 rounded-2xl border border-[#1e293b] space-y-2.5 font-mono text-[11px]">
        <div className="flex justify-between items-center text-[#94a3b8]">
          <span className="uppercase text-[10px] tracking-wider">Asset Allocation Distribution</span>
          <span className="text-[#22d3ee]">4 Mega-Cap Anchors</span>
        </div>

        {/* Multi-segment Allocation Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex gap-0.5 bg-[#070d19]">
          {holdings.map((h, idx) => {
            const pct = (h.curValue / totalValue) * 100;
            const colors = ['bg-[#22d3ee]', 'bg-[#a78bfa]', 'bg-[#38bdf8]', 'bg-[#34d399]'];
            return (
              <div
                key={h.symbol}
                className={`${colors[idx % colors.length]} h-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
                title={`${h.symbol}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Allocation Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#94a3b8] pt-1">
          {holdings.map((h, idx) => {
            const pct = (h.curValue / totalValue) * 100;
            const textColors = ['text-[#22d3ee]', 'text-[#a78bfa]', 'text-[#38bdf8]', 'text-[#34d399]'];
            return (
              <div key={h.symbol} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${textColors[idx % textColors.length]}`} />
                <span className="font-bold text-[#f1f5f9]">{h.symbol}</span>
                <span>{pct.toFixed(1)}% (₹{(h.curValue / 1000).toFixed(0)}k)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dividend Analysis & Passive Income Stream Widget */}
      <DividendAnalysisWidget
        holdings={holdings}
        onSelectStockAndTab={onSelectStockAndTab}
      />

      {/* Holdings List Table / Cards */}
      <div className="bg-[#101a2b] rounded-2xl border border-[#1e293b] p-4 overflow-hidden space-y-3">
        <h3 className="text-[14px] font-bold text-[#f1f5f9] tracking-tight">
          Current Positions
        </h3>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left font-mono text-[12px]">
            <thead>
              <tr className="border-b border-[#1e293b] text-[#64748b] text-[10px] uppercase">
                <th className="pb-2">Asset</th>
                <th className="pb-2 text-right">Qty</th>
                <th className="pb-2 text-right">Avg Cost</th>
                <th className="pb-2 text-right">Cur Price</th>
                <th className="pb-2 text-right">Current Value</th>
                <th className="pb-2 text-right">Unrealized P&amp;L</th>
                <th className="pb-2 text-center">AI Direction</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {holdings.map((holding) => (
                <tr key={holding.symbol} className="hover:bg-[#16243c] transition-colors">
                  {/* Asset */}
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#f1f5f9] text-[13px]">{holding.symbol}</span>
                      <span className="text-[10px] px-1.5 rounded bg-[#070d19] text-[#94a3b8]">{holding.exchange}</span>
                    </div>
                    <span className="text-[11px] text-[#94a3b8] font-sans truncate block max-w-[140px]">{holding.name}</span>
                  </td>

                  {/* Qty */}
                  <td className="py-3 text-right font-medium text-[#f1f5f9]">{holding.qty}</td>

                  {/* Avg Cost */}
                  <td className="py-3 text-right text-[#94a3b8]">{holding.avgBuyFormatted}</td>

                  {/* Cur Price */}
                  <td className="py-3 text-right font-semibold text-[#f1f5f9]">{holding.curPriceFormatted}</td>

                  {/* Current Value */}
                  <td className="py-3 text-right font-bold text-[#f1f5f9]">{holding.curValueFormatted}</td>

                  {/* P&L */}
                  <td className="py-3 text-right">
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        holding.pnlPercent >= 0
                          ? 'text-[#34d399] bg-[#10b981]/15'
                          : 'text-[#f87171] bg-[#ef4444]/15'
                      }`}
                    >
                      {holding.pnlFormatted}
                    </span>
                  </td>

                  {/* AI Direction */}
                  <td className="py-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        holding.direction === 'BULLISH'
                          ? 'text-[#34d399] bg-[#10b981]/10'
                          : holding.direction === 'BEARISH'
                          ? 'text-[#f87171] bg-[#ef4444]/10'
                          : 'text-[#c4b5fd] bg-[#a78bfa]/10'
                      }`}
                    >
                      {holding.direction} ({holding.directionProb}%)
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectStockAndTab(holding.symbol, 'dashboard')}
                      className="px-2.5 py-1 rounded-lg bg-[#22d3ee]/15 hover:bg-[#22d3ee]/25 text-[#22d3ee] border border-[#22d3ee]/30 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioScreen;
