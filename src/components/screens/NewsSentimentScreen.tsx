import React, { useState, useEffect } from 'react';
import { StockData, SentimentData } from '../../types/stock';
import { MarketSentimentComponent } from '../MarketSentimentComponent';
import { stockService } from '../../services/stockService';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Activity,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface NewsSentimentScreenProps {
  stock: StockData;
  allSymbols: string[];
  onSelectStock: (symbol: string) => void;
  onNavigateToXai?: () => void;
}

export const NewsSentimentScreen: React.FC<NewsSentimentScreenProps> = ({
  stock,
  allSymbols,
  onSelectStock,
  onNavigateToXai,
}) => {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);

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
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [stock.symbol]);

  // Synthetic 7-day sentiment trend history
  const sentimentTrendPoints = [
    { day: 'T-6', score: 0.45 },
    { day: 'T-5', score: 0.52 },
    { day: 'T-4', score: 0.48 },
    { day: 'T-3', score: 0.62 },
    { day: 'T-2', score: 0.58 },
    { day: 'T-1', score: 0.69 },
    { day: 'Today', score: sentimentData?.sentimentScore || 0.74 },
  ];

  return (
    <div className="flex flex-col w-full space-y-4 animate-fadeIn">
      {/* Header with Title & Active Ticker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101a2b] p-4 rounded-2xl border border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
              <Newspaper className="w-4 h-4" />
            </div>
            <h1 className="text-[18px] font-bold text-[#f1f5f9] tracking-tight">
              FinBERT Market Sentiment Intelligence
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#16243c] text-[#22d3ee] border border-[#22d3ee]/30 font-semibold">
              NLP Engine v2.4
            </span>
          </div>
          <p className="text-[12px] font-mono text-[#94a3b8] mt-1">
            Institutional news feed ingestion, entity classification, and TreeSHAP attribution
          </p>
        </div>

        {/* Ticker Selector for News */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-[11px]">
          {allSymbols.map((sym) => (
            <button
              key={sym}
              onClick={() => onSelectStock(sym)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                sym === stock.symbol
                  ? 'bg-[#22d3ee] text-[#083344] font-bold border-[#22d3ee]'
                  : 'bg-[#070d19] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Main Real-Time Market Sentiment Component */}
      <MarketSentimentComponent stock={stock} onNavigateToXai={onNavigateToXai} />

      {/* Sentiment Trend Over Time (7-Day Trajectory) */}
      <div className="bg-[#101a2b] p-4 lg:p-5 rounded-2xl border border-[#1e293b] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#22d3ee]" />
            <h3 className="text-[14px] font-bold text-[#f1f5f9] tracking-tight">
              Sentiment Trajectory Over Time (Trailing 7 Sessions)
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#94a3b8]">
            FinBERT Compound Score [-1.0 to +1.0]
          </span>
        </div>

        {/* SVG Trendline */}
        <div className="relative w-full h-36 bg-[#070d19] rounded-xl border border-[#1e293b] p-3 overflow-hidden">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 120" preserveAspectRatio="none">
            {/* Zero midline */}
            <line x1="0" y1="60" x2="700" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <text x="690" y="58" textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
              Neutral 0.0
            </text>

            {/* Line Graph */}
            {(() => {
              const points = sentimentTrendPoints.map((p, idx) => {
                const x = (idx / (sentimentTrendPoints.length - 1)) * 680 + 10;
                // score from -1 to 1 mapped to y 110 to 10
                const y = 60 - p.score * 50;
                return `${x},${y}`;
              });

              return (
                <>
                  <polyline
                    points={points.join(' ')}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {sentimentTrendPoints.map((p, idx) => {
                    const x = (idx / (sentimentTrendPoints.length - 1)) * 680 + 10;
                    const y = 60 - p.score * 50;
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="4" fill="#22d3ee" />
                        <text
                          x={x}
                          y="112"
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="10"
                          fontFamily="monospace"
                        >
                          {p.day}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NewsSentimentScreen;
