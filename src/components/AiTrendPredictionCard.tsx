import React, { useState } from 'react';
import { StockData, TimeHorizon } from '../types/stock';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Clock,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AiTrendPredictionCardProps {
  stock: StockData;
  onNavigateToXai?: () => void;
  onRecalculate?: () => void;
}

export const AiTrendPredictionCard: React.FC<AiTrendPredictionCardProps> = ({
  stock,
  onNavigateToXai,
  onRecalculate,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<TimeHorizon>('5 Days');
  const [isRecalculating, setIsRecalculating] = useState(false);

  const isBullish = stock.forecastDirection === 'BULLISH';
  const isBearish = stock.forecastDirection === 'BEARISH';

  const handleRecalculateClick = () => {
    setIsRecalculating(true);
    if (onRecalculate) onRecalculate();
    setTimeout(() => {
      setIsRecalculating(false);
    }, 700);
  };

  return (
    <div className="bg-[#101a2b] rounded-2xl border border-[#1e293b] p-4 lg:p-5 shadow-sm space-y-4">
      {/* Header with Title & Horizon Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#f1f5f9] tracking-tight flex items-center gap-1.5">
              <span>AI Trend Prediction</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#16243c] text-[#22d3ee] border border-[#22d3ee]/30">
                Ensemble ML
              </span>
            </h2>
            <span className="text-[11px] font-mono text-[#94a3b8]">
              XGBoost + Bi-LSTM Sequential Intelligence
            </span>
          </div>
        </div>

        {/* Prediction Horizon Selector */}
        <div className="flex items-center gap-1 bg-[#070d19] p-1 rounded-xl border border-[#1e293b] self-start sm:self-auto font-mono text-[11px]">
          {(['Next Day', '5 Days', '1 Month', '3 Months'] as TimeHorizon[]).map((hz) => (
            <button
              key={hz}
              onClick={() => setSelectedHorizon(hz)}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                selectedHorizon === hz
                  ? 'bg-[#16243c] text-[#22d3ee] font-bold border border-[#22d3ee]/30 shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              {hz}
            </button>
          ))}
        </div>
      </div>

      {/* Core Direction & Confidence Hero Box */}
      <div className="bg-[#070d19] p-4 rounded-xl border border-[#1e293b] grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Predicted Direction */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg shrink-0 ${
              isBullish
                ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#34d399]'
                : isBearish
                ? 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#f87171]'
                : 'bg-[#a78bfa]/15 border-[#a78bfa]/40 text-[#c4b5fd]'
            }`}
          >
            {isBullish ? (
              <TrendingUp className="w-7 h-7 stroke-[2.5]" />
            ) : isBearish ? (
              <TrendingDown className="w-7 h-7 stroke-[2.5]" />
            ) : (
              <Minus className="w-7 h-7 stroke-[2.5]" />
            )}
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] block">
              Predicted Direction ({selectedHorizon})
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-[22px] font-bold font-mono tracking-tight ${
                  isBullish
                    ? 'text-[#34d399]'
                    : isBearish
                    ? 'text-[#f87171]'
                    : 'text-[#c4b5fd]'
                }`}
              >
                {stock.forecastDirection}
              </span>
              <span className="text-[12px] font-mono text-[#94a3b8]">
                ({stock.expectedDelta})
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#64748b]">
              Target: <strong className="text-[#f1f5f9]">{stock.targetRange}</strong>
            </span>
          </div>
        </div>

        {/* Confidence Score Gauge */}
        <div className="flex items-center justify-between md:justify-center gap-4 py-2 border-y md:border-y-0 md:border-x border-[#1e293b] px-3">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#1e293b]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#22d3ee] transition-all duration-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${stock.confidence}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-[16px] font-bold text-[#f1f5f9]">
                {stock.confidence}%
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] block">
              Confidence Score
            </span>
            <span className="text-[13px] font-bold text-[#22d3ee] block">
              {stock.confidence >= 80 ? 'High Conviction' : stock.confidence >= 65 ? 'Moderate Conviction' : 'Low Conviction'}
            </span>
            <span className="text-[10px] font-mono text-[#64748b]">
              Calibrated via Brier score &amp; cross-validation
            </span>
          </div>
        </div>

        {/* Invalidation & Resistance Levels */}
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between items-center bg-[#101a2b] p-2 rounded-lg border border-[#1e293b]">
            <span className="text-[#94a3b8]">Invalidation Stop:</span>
            <span className="text-[#f87171] font-bold">{stock.invalidationLevel}</span>
          </div>
          <div className="flex justify-between items-center bg-[#101a2b] p-2 rounded-lg border border-[#1e293b]">
            <span className="text-[#94a3b8]">Structural Resistance:</span>
            <span className="text-[#34d399] font-bold">{stock.resistanceLevel}</span>
          </div>
        </div>
      </div>

      {/* Tri-Probability Distribution Bar */}
      <div className="space-y-1.5 font-mono text-[11px]">
        <div className="flex justify-between text-[#94a3b8]">
          <span>Probability Distribution</span>
          <span className="text-[#22d3ee]">{stock.confidence}% Model Agreement</span>
        </div>
        <div className="w-full h-2.5 bg-[#16243c] rounded-full overflow-hidden flex gap-0.5">
          <div
            className="bg-[#10b981] h-full transition-all duration-500 rounded-l-full"
            style={{ width: `${stock.probabilities.bullish}%` }}
            title={`Bullish ${stock.probabilities.bullish}%`}
          />
          <div
            className="bg-[#a78bfa] h-full transition-all duration-500"
            style={{ width: `${stock.probabilities.neutral}%` }}
            title={`Neutral ${stock.probabilities.neutral}%`}
          />
          <div
            className="bg-[#ef4444] h-full transition-all duration-500 rounded-r-full"
            style={{ width: `${stock.probabilities.bearish}%` }}
            title={`Bearish ${stock.probabilities.bearish}%`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#94a3b8] pt-0.5">
          <span className="text-[#34d399] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Bullish {stock.probabilities.bullish}%
          </span>
          <span className="text-[#c4b5fd] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" /> Neutral {stock.probabilities.neutral}%
          </span>
          <span className="text-[#f87171] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" /> Bearish {stock.probabilities.bearish}%
          </span>
        </div>
      </div>

      {/* Technical Indicators Influencing Result */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] block">
          Primary Influencing Indicators (TreeSHAP Attributed)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-[11px]">
          {stock.confirmationChecklist.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-[#070d19] p-2.5 rounded-xl border border-[#1e293b] flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
                <span className="text-[#f1f5f9] truncate">{item.name}</span>
              </div>
              <span className="text-[#34d399] font-bold text-[10px] shrink-0">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Supporting Evidence & Model Limitations */}
      <div className="bg-[#070d19] p-3 rounded-xl border border-[#1e293b] space-y-1.5 text-[11px] font-mono">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-[#22d3ee] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[#f1f5f9]">
              <strong>Supporting Evidence:</strong> {stock.technicalNarrative}
            </p>
            <p className="text-[#94a3b8] text-[10px] leading-relaxed">
              <strong>Model Limitations:</strong> Forecasts are optimized for regular market conditions with normal liquidity. Sudden macroeconomic rate shocks, geopolitical embargoes, or black swan regulatory filings are out-of-distribution and require human discretionary oversight.
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Timestamp, Model Freshness & Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-[#1e293b] font-mono text-[11px] text-[#94a3b8]">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#22d3ee]" />
          <span>Inference v2.4 • Ingested 2 mins ago</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecalculateClick}
            disabled={isRecalculating}
            className="px-2.5 py-1 rounded-lg bg-[#16243c] hover:bg-[#1e3a5f] text-[#f1f5f9] border border-[#1e3a5f] flex items-center gap-1 transition-colors"
          >
            <span>{isRecalculating ? 'Computing...' : 'Recalculate'}</span>
          </button>

          {onNavigateToXai && (
            <button
              onClick={onNavigateToXai}
              className="px-3 py-1 rounded-lg bg-[#22d3ee]/15 hover:bg-[#22d3ee]/25 text-[#22d3ee] border border-[#22d3ee]/40 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Explain In XAI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiTrendPredictionCard;
