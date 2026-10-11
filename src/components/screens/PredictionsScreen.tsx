import React, { useState } from 'react';
import { StockData, TimeHorizon } from '../../types/stock';

interface PredictionsScreenProps {
  stock: StockData;
  onSelectStock: (symbol: string) => void;
  onRecalculate?: () => void;
}

export const PredictionsScreen: React.FC<PredictionsScreenProps> = ({
  stock,
  onRecalculate,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<TimeHorizon>('5 Days');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  // Dynamic horizon delta
  const getHorizonDelta = () => {
    switch (selectedHorizon) {
      case 'Next Day':
        return '+0.4% to +0.9%';
      case '5 Days':
        return stock.expectedDelta;
      case '1 Month':
        return '+4.2% to +7.8%';
      case '3 Months':
        return '+8.5% to +14.2%';
      default:
        return stock.expectedDelta;
    }
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      if (onRecalculate) onRecalculate();
    }, 750);
  };

  const horizons: TimeHorizon[] = ['Next Day', '5 Days', '1 Month', '3 Months'];

  return (
    <div className="flex flex-col w-full space-y-3 pb-6 animate-fadeIn">
      {/* Sub-Header & Horizon Controller Card */}
      <div className="bg-[#1c1f2a] rounded-xl p-3.5 shadow-md flex flex-col gap-2.5 border border-[#262a35]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#262a35] flex items-center justify-center text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[20px]">candlestick_chart</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-[17px] font-semibold text-[#dfe2f1]">
                  {stock.symbol}
                </span>
                <span className="font-mono text-[11px] text-[#c7c4d7] bg-[#262a35] px-1.5 py-0.5 rounded">
                  {stock.exchange}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[15px] font-medium text-[#dfe2f1]">
                  {stock.priceFormatted}
                </span>
                <span
                  className={`font-mono text-[11px] px-1 rounded font-medium ${
                    stock.change >= 0
                      ? 'text-[#4cd7f6] bg-[#313540]'
                      : 'text-[#ffb4ab] bg-[#313540]'
                  }`}
                >
                  {stock.change >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#262a35] text-[#c7c4d7] hover:text-[#dfe2f1] active:scale-95 transition-all"
            id="refreshInferenceBtn"
          >
            <span
              className={`material-symbols-outlined text-[16px] text-[#4cd7f6] ${
                isRecalculating ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span className="font-mono text-[11px]">
              {isRecalculating ? 'Inferencing...' : 'Recalculate'}
            </span>
          </button>
        </div>

        {/* Horizon Segmented Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#0a0e18] rounded-lg">
          {horizons.map((h) => {
            const isSelected = selectedHorizon === h;
            return (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                className={`py-1.5 rounded text-center text-[11px] font-sans transition-all ${
                  isSelected
                    ? 'bg-[#262a35] text-[#4cd7f6] font-semibold shadow-sm'
                    : 'text-[#c7c4d7] hover:text-[#dfe2f1]'
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary ML Classification Inference Card */}
      <div className="relative overflow-hidden bg-[#1c1f2a] rounded-xl p-3.5 shadow-lg flex flex-col gap-3 border border-[#262a35]/60">
        {/* Subtle Ambient Glow Gradient inside card */}
        <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-[#4cd7f6]/10 blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">psychology</span>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#c7c4d7]">
              Primary Model Forecast
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#262a35] text-[#4cd7f6] font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-ping"></span>
            Inferencing Live
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 z-10">
          {/* Direction Hero Badge */}
          <div className="flex flex-col">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#313540] shadow-md ${
                stock.forecastDirection === 'BULLISH'
                  ? 'text-[#4cd7f6]'
                  : stock.forecastDirection === 'BEARISH'
                  ? 'text-[#ffb4ab]'
                  : 'text-[#d0bcff]'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {stock.forecastDirection === 'BULLISH'
                  ? 'north_east'
                  : stock.forecastDirection === 'BEARISH'
                  ? 'south_east'
                  : 'east'}
              </span>
              <span className="font-sans text-[20px] font-bold tracking-tight">
                {stock.forecastDirection}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 font-mono">
              <span className="text-[11px] text-[#c7c4d7]">Expected delta:</span>
              <span className="text-[14px] text-[#4cd7f6] font-semibold">
                {getHorizonDelta()}
              </span>
            </div>
          </div>

          {/* Circular Radial Confidence Gauge */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#313540]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              ></path>
              <path
                className="text-[#4cd7f6] transition-all duration-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${stock.confidence}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              ></path>
            </svg>
            <div className="absolute flex flex-col items-center justify-center font-mono">
              <span className="text-[16px] font-bold text-[#dfe2f1]">{stock.confidence}%</span>
              <span className="text-[9px] text-[#c7c4d7] leading-none">Conf.</span>
            </div>
          </div>
        </div>

        {/* Multi-segmented Probability Breakdown */}
        <div className="flex flex-col gap-1.5 z-10 pt-1 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#c7c4d7]">Class Probability Distribution</span>
            <span className="text-[#dfe2f1] font-medium">Multi-Horizon Softmax</span>
          </div>

          {/* Visual segmented bar */}
          <div className="h-2.5 w-full bg-[#0a0e18] rounded-full overflow-hidden flex gap-0.5">
            <div
              className="bg-[#4cd7f6] h-full rounded-l-full"
              style={{ width: `${stock.probabilities.bullish}%` }}
            ></div>
            <div
              className="bg-[#a078ff] h-full"
              style={{ width: `${stock.probabilities.neutral}%` }}
            ></div>
            <div
              className="bg-[#ffb4ab] h-full rounded-r-full"
              style={{ width: `${stock.probabilities.bearish}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="flex flex-col bg-[#171b26] p-2 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
                <span className="font-sans text-[11px] text-[#c7c4d7]">Bullish</span>
              </div>
              <span className="text-[15px] font-bold text-[#dfe2f1] mt-0.5">
                {stock.probabilities.bullish}%
              </span>
            </div>
            <div className="flex flex-col bg-[#171b26] p-2 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a078ff]"></span>
                <span className="font-sans text-[11px] text-[#c7c4d7]">Neutral</span>
              </div>
              <span className="text-[15px] font-bold text-[#dfe2f1] mt-0.5">
                {stock.probabilities.neutral}%
              </span>
            </div>
            <div className="flex flex-col bg-[#171b26] p-2 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
                <span className="font-sans text-[11px] text-[#c7c4d7]">Bearish</span>
              </div>
              <span className="text-[15px] font-bold text-[#dfe2f1] mt-0.5">
                {stock.probabilities.bearish}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Trend Change & Divergence Early Warning Banner */}
      <div className="bg-[#171b26] rounded-xl p-3.5 shadow-sm flex items-start gap-2.5 border border-[#262a35]/60">
        <div className="w-8 h-8 rounded-lg bg-[#262a35] flex items-center justify-center shrink-0 text-[#4cd7f6]">
          <span className="material-symbols-outlined text-[20px]">warning_amber</span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[13px] font-semibold text-[#dfe2f1]">
              Trend Continuation Expected
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#1c1f2a] text-[#4cd7f6] font-mono text-[10px]">
              High Reliability
            </span>
          </div>
          <p className="font-mono text-[12px] text-[#c7c4d7] mt-1 leading-snug">
            Watch{' '}
            <span className="text-[#dfe2f1] font-semibold">
              {stock.resistanceLevel} resistance level
            </span>{' '}
            for potential exhaustion volume and localized RSI divergence.
          </p>
        </div>
      </div>

      {/* Candidate Model Comparison & Selection */}
      <div className="bg-[#1c1f2a] rounded-xl p-3.5 shadow-md flex flex-col gap-2.5 border border-[#262a35]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">hub</span>
            <span className="font-sans text-[15px] font-semibold text-[#dfe2f1]">
              Candidate Ensembles
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#c0c1ff]">v2.4 Prod</span>
        </div>

        {/* Model 1 (Active Production) */}
        <div className="bg-[#262a35] rounded-lg p-2.5 flex flex-col gap-2 shadow-inner border border-[#313540]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">check_circle</span>
              <span className="font-sans text-[13px] font-semibold text-[#dfe2f1]">
                XGBoost Classifier v2.4
              </span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#0f131d] text-[#4cd7f6] font-bold">
              Active Engine
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-1 font-mono text-[12px]">
            <div className="flex flex-col">
              <span className="text-[#c7c4d7] text-[10px]">Validation Acc</span>
              <span className="text-[14px] font-semibold text-[#dfe2f1]">74.2%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#c7c4d7] text-[10px]">F1-Score</span>
              <span className="text-[14px] font-semibold text-[#dfe2f1]">0.76</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#c7c4d7] text-[10px]">ROC-AUC</span>
              <span className="text-[14px] font-semibold text-[#dfe2f1]">0.82</span>
            </div>
          </div>
        </div>

        {/* Candidate Alternative 1 */}
        <div className="bg-[#171b26] rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-[13px] font-medium text-[#dfe2f1]">
              Bi-LSTM Time-Series Network
            </span>
            <span className="font-mono text-[11px] text-[#c7c4d7]">
              Acc: 73.1% • F1: 0.74 • Epochs: 140
            </span>
          </div>
          <button className="px-2.5 py-1 rounded bg-[#1c1f2a] hover:bg-[#262a35] text-[#c7c4d7] hover:text-[#dfe2f1] font-sans text-[11px]">
            Benchmark
          </button>
        </div>

        {/* Candidate Alternative 2 */}
        <div className="bg-[#171b26] rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-[13px] font-medium text-[#dfe2f1]">
              Random Forest Ensemble
            </span>
            <span className="font-mono text-[11px] text-[#c7c4d7]">
              Acc: 71.8% • F1: 0.72 • Depth: 16
            </span>
          </div>
          <button className="px-2.5 py-1 rounded bg-[#1c1f2a] hover:bg-[#262a35] text-[#c7c4d7] hover:text-[#dfe2f1] font-sans text-[11px]">
            Benchmark
          </button>
        </div>

        {/* Expandable Loss / Confusion Matrix Trigger */}
        <button
          onClick={() => setShowMatrix(!showMatrix)}
          className="mt-1 w-full py-2 px-3 rounded-lg bg-[#171b26] hover:bg-[#262a35] text-[#c0c1ff] flex items-center justify-center gap-1.5 transition-colors font-sans text-[12px] font-semibold"
          id="toggleMatrixBtn"
        >
          <span className="material-symbols-outlined text-[18px]">table_chart</span>
          <span>
            {showMatrix
              ? 'Hide Validation Metrics'
              : 'Inspect Confusion Matrix & Validation Loss'}
          </span>
        </button>

        {/* Collapsible Matrix View */}
        {showMatrix && (
          <div className="flex flex-col gap-2 p-2.5 bg-[#0a0e18] rounded-lg animate-fadeIn font-mono text-[11px]">
            <div className="flex justify-between items-center text-[#c7c4d7]">
              <span>Confusion Matrix (N=2,450 holdout)</span>
              <span className="text-[#4cd7f6]">Log-loss: 0.384</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-[#1c1f2a] p-2 rounded flex flex-col">
                <span className="text-[#c7c4d7] text-[10px]">Pred: Bull</span>
                <span className="font-bold text-[#4cd7f6]">TP: 842</span>
              </div>
              <div className="bg-[#1c1f2a] p-2 rounded flex flex-col">
                <span className="text-[#c7c4d7] text-[10px]">Pred: Neut</span>
                <span className="font-bold text-[#dfe2f1]">FP: 114</span>
              </div>
              <div className="bg-[#1c1f2a] p-2 rounded flex flex-col">
                <span className="text-[#c7c4d7] text-[10px]">Pred: Bear</span>
                <span className="font-bold text-[#ffb4ab]">FN: 72</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trend Confirmation Engine Checklist */}
      <div className="bg-[#1c1f2a] rounded-xl p-3.5 shadow-md flex flex-col gap-2.5 border border-[#262a35]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">verified</span>
            <span className="font-sans text-[15px] font-semibold text-[#dfe2f1]">
              Trend Confirmation Engine
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#262a35] px-2 py-0.5 rounded font-mono">
            <span className="text-[14px] font-bold text-[#4cd7f6]">
              {stock.confirmationChecklist.filter((c) => c.isBullish).length}/
              {stock.confirmationChecklist.length}
            </span>
            <span className="text-[11px] text-[#c7c4d7]">Bullish</span>
          </div>
        </div>

        {/* Progress Meter */}
        <div className="w-full bg-[#0a0e18] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#4cd7f6] h-full rounded-full transition-all duration-500"
            style={{
              width: `${
                (stock.confirmationChecklist.filter((c) => c.isBullish).length /
                  stock.confirmationChecklist.length) *
                100
              }%`,
            }}
          ></div>
        </div>

        {/* Indicator List */}
        <div className="flex flex-col gap-1.5 pt-1">
          {stock.confirmationChecklist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#171b26]"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    item.isBullish
                      ? 'text-[#4cd7f6]'
                      : item.type === 'warning'
                      ? 'text-[#a078ff]'
                      : 'text-[#908fa0]'
                  }`}
                >
                  {item.isBullish ? 'check_circle' : 'info'}
                </span>
                <span className="font-sans text-[13px] text-[#dfe2f1]">{item.name}</span>
              </div>
              <span
                className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-medium ${
                  item.isBullish
                    ? 'text-[#4cd7f6] bg-[#262a35]'
                    : 'text-[#d0bcff] bg-[#262a35]'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Verbatim AI Disclaimer */}
      <div className="p-2.5 rounded-lg bg-[#0a0e18] flex items-center gap-2 text-[#c7c4d7] border border-[#262a35]/40">
        <span className="material-symbols-outlined text-[16px] text-[#908fa0] shrink-0">gavel</span>
        <p className="font-sans text-[11px] leading-tight">
          AI predictions are estimates and should not be considered financial advice.
        </p>
      </div>
    </div>
  );
};
