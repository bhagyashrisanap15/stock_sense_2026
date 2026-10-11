import React, { useState, useEffect } from 'react';
import { StockData, SentimentData } from '../types/stock';
import { stockService } from '../services/stockService';

interface MarketSentimentComponentProps {
  stock: StockData;
  onNavigateToXai?: () => void;
}

export const MarketSentimentComponent: React.FC<MarketSentimentComponentProps> = ({
  stock,
  onNavigateToXai,
}) => {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'POSITIVE' | 'NEGATIVE'>('ALL');
  const [expanded, setExpanded] = useState(false);

  // Fetch sentiment data via API call whenever active ticker changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    stockService
      .getSentimentAnalysis(stock.symbol)
      .then((data) => {
        if (isMounted) {
          setSentimentData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [stock.symbol]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await stockService.getSentimentAnalysis(stock.symbol);
      setSentimentData(data);
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  if (loading || !sentimentData) {
    return (
      <div className="bg-[#1c1f2a] p-3.5 rounded-xl border border-[#262a35]/60 shadow-sm animate-pulse space-y-2.5">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-[#262a35] rounded w-1/3"></div>
          <div className="h-4 bg-[#262a35] rounded w-1/4"></div>
        </div>
        <div className="h-10 bg-[#0a0e18] rounded-lg"></div>
        <div className="h-16 bg-[#0a0e18] rounded-lg"></div>
      </div>
    );
  }

  const isPositive = sentimentData.sentimentScore >= 0.1;
  const isNegative = sentimentData.sentimentScore <= -0.1;

  const filteredHeadlines = sentimentData.headlines.filter((item) => {
    if (activeFilter === 'POSITIVE') return item.sentiment === 'POSITIVE';
    if (activeFilter === 'NEGATIVE') return item.sentiment === 'NEGATIVE';
    return true;
  });

  return (
    <div className="bg-[#1c1f2a] p-3.5 rounded-xl flex flex-col space-y-3 border border-[#262a35]/60 shadow-sm transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
            newspaper
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#dfe2f1] font-sans">
            Real-Time News Sentiment
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="bg-[#0a0e18] text-[#c7c4d7] px-1.5 py-0.5 rounded text-[10px]">
            {sentimentData.model.split(' ')[0]}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh news sentiment"
            className="w-6 h-6 rounded bg-[#262a35] hover:bg-[#313540] text-[#c7c4d7] hover:text-[#dfe2f1] flex items-center justify-center transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[14px] ${
                refreshing ? 'animate-spin text-[#4cd7f6]' : ''
              }`}
            >
              refresh
            </span>
          </button>
        </div>
      </div>

      {/* Main Score & Tri-Bar Metrics Banner */}
      <div className="bg-[#0a0e18] p-3 rounded-lg flex flex-col space-y-2.5 border border-[#262a35]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono tracking-wider ${
                isPositive
                  ? 'bg-[#4cd7f6]/15 text-[#4cd7f6]'
                  : isNegative
                  ? 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
                  : 'bg-[#c0c1ff]/15 text-[#c0c1ff]'
              }`}
            >
              {sentimentData.overallSentiment}
            </div>
            <span className="font-mono text-[15px] font-bold text-[#dfe2f1]">
              {sentimentData.sentimentScore >= 0 ? '+' : ''}
              {sentimentData.sentimentScore.toFixed(2)}
            </span>
          </div>

          <span className="font-mono text-[10px] text-[#908fa0]">
            {sentimentData.sampleSize} articles · {sentimentData.lastUpdated}
          </span>
        </div>

        {/* Tri-Segment Probability Distribution Bar */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-[#313540] overflow-hidden flex gap-0.5">
            <div
              className="bg-[#4cd7f6] h-full rounded-l-full transition-all duration-500"
              style={{ width: `${sentimentData.positivePercent}%` }}
              title={`Positive ${sentimentData.positivePercent}%`}
            ></div>
            <div
              className="bg-[#c0c1ff] h-full transition-all duration-500"
              style={{ width: `${sentimentData.neutralPercent}%` }}
              title={`Neutral ${sentimentData.neutralPercent}%`}
            ></div>
            <div
              className="bg-[#ffb4ab] h-full rounded-r-full transition-all duration-500"
              style={{ width: `${sentimentData.negativePercent}%` }}
              title={`Negative ${sentimentData.negativePercent}%`}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#c7c4d7] pt-0.5">
            <span className="text-[#4cd7f6] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span> Positive {sentimentData.positivePercent}%
            </span>
            <span className="text-[#c0c1ff] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span> Neutral {sentimentData.neutralPercent}%
            </span>
            <span className="text-[#ffb4ab] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span> Negative {sentimentData.negativePercent}%
            </span>
          </div>
        </div>

        {/* TreeSHAP Correlation Footnote */}
        <div className="flex items-center justify-between pt-1 border-t border-[#1c1f2a] text-[10px] font-mono">
          <span className="text-[#908fa0] flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#4cd7f6]">
              bolt
            </span>
            {sentimentData.shapImpactNote}
          </span>
          {onNavigateToXai && (
            <button
              onClick={onNavigateToXai}
              className="text-[#4cd7f6] hover:underline flex items-center gap-0.5"
            >
              Verify SHAP
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            </button>
          )}
        </div>
      </div>

      {/* Headline Feed Controls & Filter Pills */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-[#c7c4d7]">Latest Ingested Headlines</span>
        <div className="flex items-center gap-1">
          {(['ALL', 'POSITIVE', 'NEGATIVE'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                activeFilter === filter
                  ? 'bg-[#262a35] text-[#dfe2f1] font-semibold'
                  : 'text-[#908fa0] hover:text-[#dfe2f1]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Headlines List */}
      <div className="space-y-1.5 font-mono text-[11px]">
        {(expanded ? filteredHeadlines : filteredHeadlines.slice(0, 2)).map((item) => (
          <div
            key={item.id}
            className="bg-[#0a0e18] p-2 rounded-lg flex flex-col space-y-1 border border-[#262a35]/40 hover:border-[#4cd7f6]/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[#dfe2f1] font-sans text-[12px] leading-snug flex-1">
                {item.title}
              </p>
              <span
                className={`text-[10px] font-mono px-1 rounded shrink-0 font-bold ${
                  item.sentiment === 'POSITIVE'
                    ? 'text-[#4cd7f6] bg-[#4cd7f6]/10'
                    : item.sentiment === 'NEGATIVE'
                    ? 'text-[#ffb4ab] bg-[#ffb4ab]/10'
                    : 'text-[#c0c1ff] bg-[#c0c1ff]/10'
                }`}
              >
                {item.score >= 0 ? '+' : ''}
                {item.score.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#908fa0]">
              <div className="flex items-center gap-1.5">
                <span>{item.source}</span>
                <span>•</span>
                <span>{item.timeAgo}</span>
              </div>
              {item.finbertTag && (
                <span className="bg-[#1c1f2a] text-[#c7c4d7] px-1 rounded text-[9px]">
                  {item.finbertTag}
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredHeadlines.length === 0 && (
          <div className="p-3 text-center text-[#908fa0] text-[11px] bg-[#0a0e18] rounded-lg">
            No headlines match the selected {activeFilter.toLowerCase()} filter.
          </div>
        )}
      </div>

      {/* Toggle View More Headlines */}
      {filteredHeadlines.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-1 text-center font-mono text-[11px] text-[#4cd7f6] hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          <span>{expanded ? 'Show Less Headlines' : `View All ${filteredHeadlines.length} Ingested Headlines`}</span>
          <span className="material-symbols-outlined text-[14px]">
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      )}
    </div>
  );
};

export default MarketSentimentComponent;
