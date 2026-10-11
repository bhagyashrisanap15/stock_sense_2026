import React from 'react';
import { StockData } from '../types/stock';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  HelpCircle,
  Play,
  TrendingDown,
  Layers,
  Info,
} from 'lucide-react';

interface RiskAssessmentPanelProps {
  stock: StockData;
  onOpenMonteCarlo?: () => void;
  showVivaMode?: boolean;
}

export const RiskAssessmentPanel: React.FC<RiskAssessmentPanelProps> = ({
  stock,
  onOpenMonteCarlo,
  showVivaMode = false,
}) => {
  // Determine severity tier
  const riskLevel =
    stock.riskScore >= 75
      ? 'Severe'
      : stock.riskScore >= 55
      ? 'High'
      : stock.riskScore >= 35
      ? 'Moderate'
      : 'Low';

  const riskColorClass =
    riskLevel === 'Severe'
      ? 'text-[#ef4444] bg-[#ef4444]/15 border-[#ef4444]/40'
      : riskLevel === 'High'
      ? 'text-[#f59e0b] bg-[#f59e0b]/15 border-[#f59e0b]/40'
      : riskLevel === 'Moderate'
      ? 'text-[#38bdf8] bg-[#38bdf8]/15 border-[#38bdf8]/40'
      : 'text-[#34d399] bg-[#10b981]/15 border-[#10b981]/40';

  return (
    <div className="bg-[#101a2b] rounded-2xl border border-[#1e293b] p-4 lg:p-5 shadow-sm space-y-4">
      {/* Header with Title & Level Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#f1f5f9] tracking-tight flex items-center gap-1.5">
              <span>Quantitative Risk Assessment</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${riskColorClass}`}>
                {riskLevel} Risk
              </span>
            </h2>
            <span className="text-[11px] font-mono text-[#94a3b8]">
              Parametric &amp; Non-Parametric Tail Distribution
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenMonteCarlo && (
            <button
              onClick={onOpenMonteCarlo}
              className="px-3 py-1.5 rounded-xl bg-[#16243c] hover:bg-[#1e3a5f] text-[#22d3ee] border border-[#22d3ee]/30 flex items-center gap-1.5 font-mono text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Vol Surface</span>
            </button>
          )}
          {onOpenMonteCarlo && (
            <button
              onClick={onOpenMonteCarlo}
              className="px-3 py-1.5 rounded-xl bg-[#16243c] hover:bg-[#1e3a5f] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e293b] items-center gap-1.5 font-mono text-[11px] font-semibold transition-colors cursor-pointer hidden sm:flex"
            >
              <Play className="w-3.5 h-3.5 fill-[#94a3b8]" />
              <span>Monte Carlo</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Quantitative Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-[11px]">
        {/* Metric 1: Value at Risk (VaR 95%) */}
        <div className="bg-[#070d19] p-3 rounded-xl border border-[#1e293b] space-y-1">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span>VaR (1D, 95% CI)</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-[#16243c] text-[#f87171]">Tail Risk</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[18px] font-bold text-[#f87171]">{stock.var95}%</span>
          </div>
          <span className="text-[10px] text-[#64748b] block">
            {stock.varAmount} single-day limit
          </span>
        </div>

        {/* Metric 2: Annualized Volatility */}
        <div className="bg-[#070d19] p-3 rounded-xl border border-[#1e293b] space-y-1">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span>Annualized Volatility</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-[#16243c] text-[#38bdf8]">252-Day</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[18px] font-bold text-[#f1f5f9]">{stock.volatilityAnn}%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-0.5">
            <span className="text-[#64748b]">Downside: {stock.downsideDev}%</span>
            {onOpenMonteCarlo && (
              <button
                onClick={onOpenMonteCarlo}
                className="text-[#22d3ee] hover:underline font-semibold"
              >
                3D Surface →
              </button>
            )}
          </div>
        </div>

        {/* Metric 3: Max Drawdown */}
        <div className="bg-[#070d19] p-3 rounded-xl border border-[#1e293b] space-y-1">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span>Max Drawdown</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-[#16243c] text-[#f59e0b]">Peak-to-Trough</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[18px] font-bold text-[#f87171]">{stock.maxDrawdown}%</span>
          </div>
          <span className="text-[10px] text-[#64748b] block">
            Trailing 52-week correction
          </span>
        </div>

        {/* Metric 4: Beta & Market Correlation */}
        <div className="bg-[#070d19] p-3 rounded-xl border border-[#1e293b] space-y-1">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span>Market Beta</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-[#16243c] text-[#22d3ee]">Systemic</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[18px] font-bold text-[#f1f5f9]">{stock.beta}</span>
            <span className="text-[10px] text-[#94a3b8]">
              {stock.beta < 1 ? 'Defensive' : 'Aggressive'}
            </span>
          </div>
          <span className="text-[10px] text-[#64748b] block">
            Benchmark: {stock.exchange === 'NSE' ? 'NIFTY 50' : 'NASDAQ'}
          </span>
        </div>
      </div>

      {/* Ratios & Factor Stress Spectrum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
        {/* Risk-Adjusted Return Ratios */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-2.5">
          <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] block">
            Risk-Adjusted Return Ratios
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#101a2b] p-2 rounded-lg border border-[#1e293b]">
              <span className="text-[#94a3b8] block text-[10px]">Sharpe Ratio (Rf=6.5%)</span>
              <span className="text-[16px] font-bold text-[#34d399]">{stock.sharpeRatio.toFixed(2)}</span>
              <span className="text-[9px] text-[#64748b] block">Excess return per unit vol</span>
            </div>
            <div className="bg-[#101a2b] p-2 rounded-lg border border-[#1e293b]">
              <span className="text-[#94a3b8] block text-[10px]">Sortino Ratio</span>
              <span className="text-[16px] font-bold text-[#34d399]">{stock.sortinoRatio.toFixed(2)}</span>
              <span className="text-[9px] text-[#64748b] block">Downside volatility ratio</span>
            </div>
          </div>
        </div>

        {/* Factor Stress Breakdown */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] block">
            Factor Stress Spectrum (1 to 5)
          </span>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8]">Tail Risk Exposure</span>
              <span className="text-[#22d3ee]">{stock.factors.tailRisk.label}</span>
            </div>
            <div className="w-full bg-[#16243c] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#22d3ee] h-full rounded-full"
                style={{ width: `${(stock.factors.tailRisk.score / 5) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[#94a3b8]">Drawdown Sensitivity</span>
              <span className="text-[#f59e0b]">{stock.factors.drawdown.label}</span>
            </div>
            <div className="w-full bg-[#16243c] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#f59e0b] h-full rounded-full"
                style={{ width: `${(stock.factors.drawdown.score / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plain-English Investor Interpretation Card */}
      <div className="bg-[#070d19] p-4 rounded-xl border border-[#1e3a5f]/40 space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#22d3ee] shrink-0" />
          <h3 className="text-[13px] font-bold text-[#f1f5f9] tracking-tight">
            Plain-English Investor Interpretation
          </h3>
        </div>
        <p className="text-[12px] text-[#94a3b8] leading-relaxed font-sans">
          {stock.eli5Narrative}
        </p>

        {showVivaMode && (
          <div className="pt-2 mt-2 border-t border-[#1e293b] space-y-1.5 font-mono text-[11px]">
            <div className="text-[#22d3ee] font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Engineering Viva Defense (Statistical Justification):</span>
            </div>
            <p className="text-[#94a3b8] text-[10px] leading-relaxed">
              {stock.vivaVaRLogic}
            </p>
            <p className="text-[#94a3b8] text-[10px] leading-relaxed">
              {stock.vivaBetaLogic}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessmentPanel;
