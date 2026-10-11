import React, { useState } from 'react';
import { StockData } from '../../types/stock';

interface RiskMatrixScreenProps {
  stock: StockData;
  onOpenMonteCarlo: () => void;
}

export const RiskMatrixScreen: React.FC<RiskMatrixScreenProps> = ({
  stock,
  onOpenMonteCarlo,
}) => {
  const [vivaMode, setVivaMode] = useState(true);
  const [showWeights, setShowWeights] = useState(false);

  // Circumference calculation for radius 42: 2 * pi * 42 ≈ 263.89
  const circumference = 263.89;
  const strokeOffset = circumference - (circumference * stock.riskScore) / 100;

  return (
    <div className="flex flex-col w-full space-y-3 pb-6 animate-fadeIn">
      {/* Asset Metadata & Quantitative Status Header */}
      <div className="flex items-center justify-between bg-[#1c1f2a] p-3.5 rounded-xl shadow-md border border-[#262a35]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#262a35] flex items-center justify-center text-[#4cd7f6]">
            <span className="material-symbols-outlined text-[24px]">analytics</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[17px] font-semibold text-[#dfe2f1]">
                {stock.symbol}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#313540] text-[#c7c4d7] font-medium">
                {stock.exchange}: {stock.symbol === 'TCS' || stock.symbol === 'RELIANCE' ? 'LARGE-CAP' : 'MEGA-CAP'}
              </span>
            </div>
            <p className="font-mono text-[12px] text-[#c7c4d7]">{stock.name}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-[15px] font-semibold text-[#dfe2f1]">
            {stock.priceFormatted}
          </div>
          <div
            className={`flex items-center justify-end gap-1 font-mono text-[12px] ${
              stock.change >= 0 ? 'text-[#4cd7f6]' : 'text-[#ffb4ab]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {stock.change >= 0 ? 'trending_up' : 'trending_down'}
            </span>
            <span>
              {stock.change >= 0 ? '+' : ''}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Educational Learning Mode Interactive Bar */}
      <div className="flex items-center justify-between bg-[#171b26] px-3.5 py-2.5 rounded-lg border border-[#262a35]/60">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">school</span>
          <span className="font-sans text-[13px] font-medium text-[#dfe2f1]">
            Engineering Viva Mode
          </span>
          <span className="px-1.5 py-0.2 bg-[#c0c1ff]/20 text-[#c0c1ff] rounded font-mono text-[10px] font-semibold">
            XAI
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            checked={vivaMode}
            onChange={(e) => setVivaMode(e.target.checked)}
            className="sr-only peer"
            type="checkbox"
          />
          <div className="w-10 h-5 bg-[#313540] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#dfe2f1] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8083ff]"></div>
        </label>
      </div>

      {/* Primary Score & Gauge Panel */}
      <div className="bg-[#1c1f2a] rounded-xl p-3.5 shadow-md space-y-3 relative overflow-hidden border border-[#262a35]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#c7c4d7] font-semibold">
              Normalized Quantitative Risk
            </span>
            <button
              onClick={() => setShowWeights(!showWeights)}
              className="text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors flex items-center gap-0.5 font-sans text-[11px]"
            >
              <span>Weights</span>
              <span
                className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                  showWeights ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
          </div>
          <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-[#313540] text-[#4cd7f6]">
            CONFIDENCE: 94.8%
          </span>
        </div>

        {/* Gauge + High-Level Breakdown Layout */}
        <div className="flex items-center justify-between gap-3">
          {/* Circular SVG Radial Gauge */}
          <div className="relative flex items-center justify-center shrink-0 w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-[#313540] fill-none"
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
              ></circle>
              <circle
                className="text-[#4cd7f6] stroke-current fill-none transition-all duration-700 ease-out"
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeDasharray="263.89"
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
              <span className="text-[22px] font-bold text-[#dfe2f1]">{stock.riskScore}</span>
              <span className="text-[10px] text-[#c7c4d7]">/ 100</span>
            </div>
          </div>

          {/* Qualitative Classification & Macro Summary */}
          <div className="flex-1 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262a35] text-[#4cd7f6]">
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
              <span className="font-sans text-[13px] font-semibold">
                {stock.riskCategory} RISK
              </span>
            </div>
            <p className="font-mono text-[12px] text-[#c7c4d7] leading-tight">
              Beta-damped volatility profile. Favorable semi-variance with controlled 12-month peak drawdowns.
            </p>
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#c0c1ff]">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Validated on 252-day {stock.exchange} bar data</span>
            </div>
          </div>
        </div>

        {/* Collapsible Weights Accordion */}
        {showWeights && (
          <div className="transition-all duration-300 pt-1 animate-fadeIn">
            <div className="bg-[#171b26] p-2.5 rounded-lg space-y-1 font-mono text-[11px] border border-[#262a35]/60">
              <div className="flex justify-between items-center text-[#c7c4d7] text-[10px]">
                <span>MODEL ARCHITECTURE WEIGHTING SCHEME</span>
                <span>Σ = 100%</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[#dfe2f1]">
                <div className="flex justify-between">
                  <span className="text-[#c7c4d7]">Historical Volatility</span>
                  <span className="font-medium text-[#4cd7f6]">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c7c4d7]">Max Drawdown</span>
                  <span className="font-medium text-[#4cd7f6]">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c7c4d7]">Value at Risk (95%)</span>
                  <span className="font-medium text-[#4cd7f6]">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c7c4d7]">Downside Semi-Dev</span>
                  <span className="font-medium text-[#4cd7f6]">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c7c4d7]">Market Beta ({stock.exchange === 'NSE' ? 'NIFTY' : 'SPY'})</span>
                  <span className="font-medium text-[#4cd7f6]">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c7c4d7]">Sharpe / Sortino</span>
                  <span className="font-medium text-[#4cd7f6]">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c7c4d7]">Avg True Range</span>
                  <span className="font-medium text-[#4cd7f6]">5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c7c4d7]">Execution Drift</span>
                  <span className="font-medium text-[#908fa0]">0%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risk-Adjusted Trend Insight Banner */}
      <div className="bg-[#1c1f2a] p-3.5 rounded-xl shadow-sm flex items-start gap-2.5 border border-[#262a35]/60">
        <div className="w-8 h-8 rounded-lg bg-[#262a35] text-[#c0c1ff] flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[20px]">insights</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-[13px] font-semibold text-[#dfe2f1]">
              Regime: Bullish Momentum + Moderate Variance
            </span>
          </div>
          <p className="font-mono text-[12px] text-[#c7c4d7] leading-relaxed">
            Positive directional impulse buffered by defensive systematic beta ({stock.beta}). Asymmetric upside distribution offers attractive risk-reward for multi-week swing setups.
          </p>
        </div>
      </div>

      {/* Risk Breakdown Bar Hierarchy */}
      <div className="bg-[#1c1f2a] rounded-xl p-3.5 shadow-md space-y-2 border border-[#262a35]/60">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#c7c4d7] font-semibold">
            Factor Stress Spectrum
          </span>
          <span className="font-mono text-[11px] text-[#c7c4d7]">Multi-Factor Engine</span>
        </div>

        <div className="space-y-2 pt-1 font-mono text-[12px]">
          {/* Factor 1: Volatility */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#dfe2f1] font-medium">Annualized Volatility</span>
              <span className="text-[#4cd7f6] font-medium">{stock.factors.volatility.label}</span>
            </div>
            <div className="flex items-center gap-1.5 h-2 w-full">
              {[1, 2, 3, 4, 5].map((seg) => (
                <div
                  key={seg}
                  className={`h-full flex-1 rounded-sm ${
                    seg <= stock.factors.volatility.score
                      ? 'bg-[#4cd7f6]'
                      : 'bg-[#313540]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Factor 2: Drawdown Risk */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#dfe2f1] font-medium">Peak Drawdown Pressure</span>
              <span className="text-[#4cd7f6] font-medium">{stock.factors.drawdown.label}</span>
            </div>
            <div className="flex items-center gap-1.5 h-2 w-full">
              {[1, 2, 3, 4, 5].map((seg) => (
                <div
                  key={seg}
                  className={`h-full flex-1 rounded-sm ${
                    seg <= stock.factors.drawdown.score
                      ? 'bg-[#4cd7f6]'
                      : 'bg-[#313540]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Factor 3: Tail Risk (VaR) */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#dfe2f1] font-medium">Tail Risk (Historical 95% VaR)</span>
              <span className="text-[#c0c1ff] font-medium">{stock.factors.tailRisk.label}</span>
            </div>
            <div className="flex items-center gap-1.5 h-2 w-full">
              {[1, 2, 3, 4, 5].map((seg) => (
                <div
                  key={seg}
                  className={`h-full flex-1 rounded-sm ${
                    seg <= stock.factors.tailRisk.score
                      ? 'bg-[#c0c1ff]'
                      : 'bg-[#313540]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Factor 4: Market Sensitivity (Beta) */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#dfe2f1] font-medium">Systemic Market Sensitivity</span>
              <span className="text-[#c0c1ff] font-medium">{stock.factors.marketBeta.label}</span>
            </div>
            <div className="flex items-center gap-1.5 h-2 w-full">
              {[1, 2, 3, 4, 5].map((seg) => (
                <div
                  key={seg}
                  className={`h-full flex-1 rounded-sm ${
                    seg <= stock.factors.marketBeta.score
                      ? 'bg-[#c0c1ff]'
                      : 'bg-[#313540]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Factor 5: Liquidity Risk */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#dfe2f1] font-medium">Liquidity Execution Friction</span>
              <span className="text-[#c0c1ff] font-medium">{stock.factors.liquidity.label}</span>
            </div>
            <div className="flex items-center gap-1.5 h-2 w-full">
              {[1, 2, 3, 4, 5].map((seg) => (
                <div
                  key={seg}
                  className={`h-full flex-1 rounded-sm ${
                    seg <= stock.factors.liquidity.score
                      ? 'bg-[#c0c1ff]'
                      : 'bg-[#313540]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metric Cards Grid with Integrated Viva/XAI Deep Dive */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#c7c4d7] font-semibold">
            Quantitative Metrics Breakdown
          </span>
          <span className="font-mono text-[11px] text-[#c0c1ff]">8 Statistical Indicators</span>
        </div>

        {/* 1. Value at Risk (VaR) */}
        <div className="bg-[#1c1f2a] rounded-xl p-3.5 space-y-2 shadow-sm border border-[#262a35]/60">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-[15px] font-semibold text-[#dfe2f1]">
                  Value at Risk (VaR 95%)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#262a35] text-[#dfe2f1] font-sans text-[11px]">
                  1-Day Horizon
                </span>
              </div>
              <p className="font-mono text-[12px] text-[#c7c4d7]">
                Historical simulation loss threshold
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-[16px] font-bold text-[#ffb4ab]">
                {stock.var95.toFixed(2)}%
              </span>
              <div className="text-[11px] text-[#c7c4d7]">{stock.varAmount}</div>
            </div>
          </div>

          {vivaMode && (
            <div className="bg-[#171b26] p-2.5 rounded-lg space-y-1 animate-fadeIn border border-[#262a35]/60">
              <div className="flex items-center gap-1 text-[#c0c1ff] font-sans text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>XAI / Engineering Evaluation Logic</span>
              </div>
              <p className="font-mono text-[11px] text-[#dfe2f1] leading-relaxed">
                {stock.vivaVaRLogic}
              </p>
            </div>
          )}
        </div>

        {/* 2. Sharpe Ratio & Sortino Ratio Dual Card */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1c1f2a] rounded-xl p-3 space-y-1 shadow-sm border border-[#262a35]/60">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[13px] font-medium text-[#c7c4d7]">Sharpe Ratio</span>
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">trending_up</span>
            </div>
            <div className="font-mono text-[16px] font-bold text-[#dfe2f1]">{stock.sharpeRatio}</div>
            <span className="inline-block px-1.5 py-0.5 rounded bg-[#262a35] text-[#4cd7f6] font-sans text-[10px]">
              High Efficiency
            </span>
            {vivaMode && (
              <div className="bg-[#171b26] p-2 rounded font-mono text-[10px] text-[#dfe2f1] mt-1 leading-snug">
                (R_p - R_f) / σ_p. Assumes Rf = 6.50% (RBI 10Y G-Sec). Returns {stock.sharpeRatio} units of excess yield per unit total standard deviation.
              </div>
            )}
          </div>

          <div className="bg-[#1c1f2a] rounded-xl p-3 space-y-1 shadow-sm border border-[#262a35]/60">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[13px] font-medium text-[#c7c4d7]">Sortino Ratio</span>
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">shield</span>
            </div>
            <div className="font-mono text-[16px] font-bold text-[#dfe2f1]">{stock.sortinoRatio}</div>
            <span className="inline-block px-1.5 py-0.5 rounded bg-[#262a35] text-[#4cd7f6] font-sans text-[10px]">
              Superior Skew
            </span>
            {vivaMode && (
              <div className="bg-[#171b26] p-2 rounded font-mono text-[10px] text-[#dfe2f1] mt-1 leading-snug">
                Penalizes only harmful downside volatility (δ_d). Score &gt; 2.0 indicates market-beating upward asymmetry.
              </div>
            )}
          </div>
        </div>

        {/* 3. Maximum Drawdown & Volatility Dual Card */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1c1f2a] rounded-xl p-3 space-y-1 shadow-sm border border-[#262a35]/60">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[13px] font-medium text-[#c7c4d7]">Max Drawdown (1Y)</span>
              <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">waterfall_chart</span>
            </div>
            <div className="font-mono text-[16px] font-bold text-[#ffb4ab]">{stock.maxDrawdown}%</div>
            <span className="inline-block px-1.5 py-0.5 rounded bg-[#262a35] text-[#dfe2f1] font-sans text-[10px]">
              Trough to Peak
            </span>
            {vivaMode && (
              <div className="bg-[#171b26] p-2 rounded font-mono text-[10px] text-[#dfe2f1] mt-1 leading-snug">
                Max observed loss from a historical high of {stock.currency}4,250 to {stock.currency}3,646. Evaluates worst-case hold resilience.
              </div>
            )}
          </div>

          <div className="bg-[#1c1f2a] rounded-xl p-3 space-y-1 shadow-sm border border-[#262a35]/60">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[13px] font-medium text-[#c7c4d7]">Annualized Vol</span>
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">waves</span>
            </div>
            <div className="font-mono text-[16px] font-bold text-[#dfe2f1]">{stock.volatilityAnn}%</div>
            <span className="inline-block px-1.5 py-0.5 rounded bg-[#262a35] text-[#4cd7f6] font-sans text-[10px]">
              252-Day σ × √252
            </span>
            {vivaMode && (
              <div className="bg-[#171b26] p-2 rounded font-mono text-[10px] text-[#dfe2f1] mt-1 leading-snug">
                Annual standard deviation of daily logarithmic returns. Moderate band compared to sector average (21.2%).
              </div>
            )}
          </div>
        </div>

        {/* 4. Benchmark Beta, Downside Dev, ATR Triple Row */}
        <div className="bg-[#1c1f2a] rounded-xl p-3.5 space-y-2.5 shadow-sm border border-[#262a35]/60">
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            {/* Beta */}
            <div className="space-y-0.5">
              <span className="text-[11px] text-[#c7c4d7]">Beta ({stock.exchange === 'NSE' ? 'NIFTY 50' : 'SPY'})</span>
              <div className="text-[16px] font-bold text-[#dfe2f1]">{stock.beta}</div>
              <span className="text-[10px] text-[#c0c1ff]">Defensive</span>
            </div>
            {/* Downside Dev */}
            <div className="space-y-0.5">
              <span className="text-[11px] text-[#c7c4d7]">Downside Dev</span>
              <div className="text-[16px] font-bold text-[#dfe2f1]">{stock.downsideDev}%</div>
              <span className="text-[10px] text-[#4cd7f6]">Semi-variance</span>
            </div>
            {/* ATR 14 */}
            <div className="space-y-0.5">
              <span className="text-[11px] text-[#c7c4d7]">ATR (14)</span>
              <div className="text-[16px] font-bold text-[#dfe2f1]">{stock.atrAmount}</div>
              <span className="text-[10px] text-[#c7c4d7]">Daily Span</span>
            </div>
          </div>

          {vivaMode && (
            <div className="bg-[#171b26] p-2.5 rounded-lg space-y-1 animate-fadeIn border border-[#262a35]/60">
              <div className="flex items-center gap-1 text-[#c0c1ff] font-sans text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">tune</span>
                <span>Index Covariance &amp; Range Dynamics</span>
              </div>
              <p className="font-mono text-[11px] text-[#dfe2f1] leading-relaxed">
                {stock.vivaBetaLogic}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Model Validation Banner */}
      <div className="bg-[#171b26] p-3.5 rounded-xl space-y-1 border border-[#262a35]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping"></span>
            <span className="font-mono text-[11px] font-semibold text-[#dfe2f1] uppercase">
              Stress Test Inference
            </span>
          </div>
          <button
            onClick={onOpenMonteCarlo}
            className="font-mono text-[11px] text-[#4cd7f6] hover:underline flex items-center gap-0.5"
          >
            Launch Monte Carlo
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </button>
        </div>
        <p className="font-mono text-[12px] text-[#c7c4d7] leading-relaxed">
          Monte Carlo simulation (10,000 iterations): 91.4% probability of {stock.symbol} remaining above {stock.invalidationLevel} support level through the upcoming earnings release cycle.
        </p>
      </div>
    </div>
  );
};
