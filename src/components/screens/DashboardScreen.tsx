import React, { useState } from 'react';
import { StockData } from '../../types/stock';
import { MarketOverviewBar } from '../MarketOverviewBar';
import { StockChartPanel } from '../StockChartPanel';
import { AiTrendPredictionCard } from '../AiTrendPredictionCard';
import { RiskAssessmentPanel } from '../RiskAssessmentPanel';
import { MarketSentimentComponent } from '../MarketSentimentComponent';
import {
  Sparkles,
  ShieldAlert,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface DashboardScreenProps {
  stock: StockData;
  allSymbols: string[];
  onSelectStock: (symbol: string) => void;
  onNavigateToTab: (tab: any) => void;
  onToggleWatchlist?: (symbol: string) => void;
  isInWatchlist?: boolean;
  isLive?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  stock,
  allSymbols,
  onSelectStock,
  onNavigateToTab,
  onToggleWatchlist,
  isInWatchlist = false,
  isLive = true,
}) => {
  return (
    <div className="flex flex-col w-full space-y-5 animate-fadeIn">
      {/* 1. Top Market Overview Bar (NIFTY 50, SENSEX, S&P 500, NASDAQ, Selected Stock) */}
      <MarketOverviewBar
        activeStock={stock}
        isLive={isLive}
        onSelectIndexStock={onSelectStock}
      />

      {/* 2. Main Stock Analysis & Interactive Historical Chart Panel */}
      <StockChartPanel
        stock={stock}
        allSymbols={allSymbols}
        onSelectStock={onSelectStock}
        onToggleWatchlist={onToggleWatchlist}
        isInWatchlist={isInWatchlist}
      />

      {/* 3. AI Trend Prediction Card */}
      <AiTrendPredictionCard
        stock={stock}
        onNavigateToXai={() => onNavigateToTab('xai-explainability')}
      />

      {/* 4. Grid: Quantitative Risk Assessment & Real-Time News Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Risk Assessment Panel */}
        <RiskAssessmentPanel
          stock={stock}
          onOpenMonteCarlo={() => onNavigateToTab('risk-matrix')}
          showVivaMode={false}
        />

        {/* Real-time FinBERT Market Sentiment Component */}
        <div className="space-y-4">
          <MarketSentimentComponent
            stock={stock}
            onNavigateToXai={() => onNavigateToTab('xai-explainability')}
          />

          {/* Quick Explainable AI Preview Card */}
          <div className="bg-[#101a2b] p-4 lg:p-5 rounded-2xl border border-[#1e293b] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#22d3ee]" />
                <h3 className="text-[14px] font-bold text-[#f1f5f9] tracking-tight">
                  Explainable AI (TreeSHAP Summary)
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#22d3ee] px-2 py-0.5 rounded bg-[#22d3ee]/10">
                {stock.netShap}
              </span>
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed font-sans">
              Top positive attribution driven by <strong>{stock.shapFactors[0]?.name}</strong> ({stock.shapFactors[0]?.rawFormatted}) and <strong>{stock.shapFactors[1]?.name}</strong> ({stock.shapFactors[1]?.rawFormatted}).
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-[#64748b]">
                Baseline log-odds: {stock.baselineLogOdds} → Final: {stock.finalLogOdds}
              </span>
              <button
                onClick={() => onNavigateToTab('xai-explainability')}
                className="text-[11px] font-mono font-bold text-[#22d3ee] hover:underline flex items-center gap-1"
              >
                <span>Full Feature Attribution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory & Institutional Research Disclaimer */}
      <div className="bg-[#0a1120] p-3.5 rounded-xl border border-[#1e293b] flex items-start gap-3 text-[#94a3b8] text-[11px] font-mono">
        <Info className="w-4 h-4 text-[#22d3ee] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          StockSense AI employs computational mathematical models and non-parametric historical return distributions. Inferences are probabilistic and intended for educational &amp; engineering evaluation; they do not constitute registered financial advisory services.
        </p>
      </div>
    </div>
  );
};

export default DashboardScreen;
