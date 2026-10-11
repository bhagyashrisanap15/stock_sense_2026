import React, { useState, useMemo } from 'react';
import { StockData, ChartRange, ChartType, CandleDataPoint } from '../types/stock';
import { generateCandleSeries } from '../data/chartHistoricalData';
import { StockSearchBar } from './StockSearchBar';
import {
  TrendingUp,
  TrendingDown,
  Sliders,
  BarChart2,
  Activity,
  Layers,
  AlertCircle,
  Eye,
  RefreshCw,
  Clock,
} from 'lucide-react';

interface StockChartPanelProps {
  stock: StockData;
  allSymbols: string[];
  onSelectStock: (symbol: string) => void;
  onToggleWatchlist?: (symbol: string) => void;
  isInWatchlist?: boolean;
}

export const StockChartPanel: React.FC<StockChartPanelProps> = ({
  stock,
  allSymbols,
  onSelectStock,
  onToggleWatchlist,
  isInWatchlist = false,
}) => {
  const [range, setRange] = useState<ChartRange>('1M');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [showSma20, setShowSma20] = useState(true);
  const [showSma50, setShowSma50] = useState(false);
  const [showEma20, setShowEma20] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleDataPoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate candle data for current range and stock
  const candleData = useMemo(() => {
    return generateCandleSeries(stock.price, range, stock.forecastDirection);
  }, [stock.price, range, stock.forecastDirection]);

  // Price bounds for SVG scale
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (candleData.length === 0) return { minPrice: 0, maxPrice: 100, maxVolume: 1000 };
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    candleData.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const padding = (max - min) * 0.08 || 1;
    return {
      minPrice: Math.max(0, min - padding),
      maxPrice: max + padding,
      maxVolume: maxVol,
    };
  }, [candleData]);

  // Active displayed candle (hovered or last available)
  const currentHover = hoveredCandle || candleData[candleData.length - 1];

  const handleSimulateRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  return (
    <section aria-label="Main Stock Analysis" className="bg-[#101a2b] rounded-2xl border border-[#1e293b] p-4 lg:p-5 shadow-sm space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Prominent StockSense AI Search Bar */}
        <div className="flex-1 min-w-0">
          <StockSearchBar
            onSelectStock={onSelectStock}
            activeSymbol={stock.symbol}
            className="w-full"
          />
        </div>

        {/* Quick Ticker Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-[11px] py-0.5 shrink-0">
          <span className="text-[10px] text-[#64748b] hidden sm:inline mr-1 uppercase">QUICK:</span>
          {allSymbols.slice(0, 8).map((sym) => {
            const isActive = sym === stock.symbol;
            return (
              <button
                key={sym}
                onClick={() => onSelectStock(sym)}
                className={`px-2.5 py-1.5 rounded-xl shrink-0 flex items-center gap-1 border transition-all ${
                  isActive
                    ? 'bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/40 font-bold shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'bg-[#070d19] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9] hover:bg-[#16243c]'
                }`}
              >
                <span>{sym}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stock Information Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] lg:text-[24px] font-bold text-[#f1f5f9] tracking-tight">
              {stock.name}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#16243c] text-[#22d3ee] border border-[#22d3ee]/30">
              {stock.symbol}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#1e293b] text-[#94a3b8]">
              {stock.exchange}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-[12px] font-mono text-[#94a3b8]">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                stock.marketOpen
                  ? 'bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30'
                  : 'bg-[#64748b]/15 text-[#94a3b8] border border-[#64748b]/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${stock.marketOpen ? 'bg-[#10b981] animate-pulse' : 'bg-[#64748b]'}`} />
              {stock.marketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
            </span>
            <span>•</span>
            <span>Vol: {stock.volume}</span>
            <span>•</span>
            <span>Beta: {stock.beta}</span>
          </div>
        </div>

        {/* Price & Change Badge */}
        <div className="flex items-baseline md:items-end flex-col">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[26px] lg:text-[28px] font-bold text-[#f1f5f9] tracking-tight">
              {stock.priceFormatted}
            </span>
            <div
              className={`flex items-center gap-1 font-mono text-[13px] font-bold px-2 py-0.5 rounded-lg ${
                stock.change >= 0
                  ? 'text-[#10b981] bg-[#10b981]/15 border border-[#10b981]/30'
                  : 'text-[#ef4444] bg-[#ef4444]/15 border border-[#ef4444]/30'
              }`}
            >
              {stock.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>
                {stock.change >= 0 ? '+' : ''}
                {stock.currency}
                {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}
                {stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#64748b] mt-0.5">
            Consolidated Real-time Telemetry (SEBI / SEC compliant)
          </span>
        </div>
      </div>

      {/* Chart Controls Bar (Ranges, Chart Type, Indicator Overlays) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#070d19] p-2 rounded-xl border border-[#1e293b]">
        {/* Timeframe Selectors */}
        <div className="flex items-center gap-1 font-mono text-[11px]">
          {(['1D', '1W', '1M', '3M', '6M', '1Y'] as ChartRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-lg transition-colors font-semibold ${
                range === r
                  ? 'bg-[#22d3ee] text-[#083344] shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#16243c]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Chart View Toggle: Candlestick vs Line */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#101a2b] p-0.5 rounded-lg border border-[#1e293b]">
            <button
              onClick={() => setChartType('candlestick')}
              title="Candlestick Chart"
              className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-mono transition-colors ${
                chartType === 'candlestick'
                  ? 'bg-[#16243c] text-[#22d3ee] font-bold'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Candles</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              title="Line Chart"
              className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-mono transition-colors ${
                chartType === 'line'
                  ? 'bg-[#16243c] text-[#22d3ee] font-bold'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Line</span>
            </button>
          </div>

          {/* Technical Overlays Toggles */}
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <button
              onClick={() => setShowSma20(!showSma20)}
              className={`px-2 py-1 rounded border transition-colors ${
                showSma20
                  ? 'bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/40'
                  : 'bg-[#101a2b] text-[#64748b] border-[#1e293b]'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowSma50(!showSma50)}
              className={`px-2 py-1 rounded border transition-colors ${
                showSma50
                  ? 'bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/40'
                  : 'bg-[#101a2b] text-[#64748b] border-[#1e293b]'
              }`}
            >
              SMA 50
            </button>
            <button
              onClick={() => setShowEma20(!showEma20)}
              className={`px-2 py-1 rounded border transition-colors ${
                showEma20
                  ? 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/40'
                  : 'bg-[#101a2b] text-[#64748b] border-[#1e293b]'
              }`}
            >
              EMA 20
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-1 rounded border transition-colors ${
                showVolume
                  ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40'
                  : 'bg-[#101a2b] text-[#64748b] border-[#1e293b]'
              }`}
            >
              VOL
            </button>
          </div>
        </div>
      </div>

      {/* Hover HUD / Crosshair Readout Banner */}
      {currentHover && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#070d19]/80 rounded-xl border border-[#1e293b]/70 font-mono text-[11px] text-[#94a3b8]">
          <div className="flex items-center gap-2 text-[#f1f5f9]">
            <span className="text-[#22d3ee] font-semibold">{currentHover.date}</span>
            <span>O: <strong className="text-[#f1f5f9]">{stock.currency}{currentHover.open}</strong></span>
            <span>H: <strong className="text-[#34d399]">{stock.currency}{currentHover.high}</strong></span>
            <span>L: <strong className="text-[#f87171]">{stock.currency}{currentHover.low}</strong></span>
            <span>C: <strong className="text-[#f1f5f9]">{stock.currency}{currentHover.close}</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            {showVolume && <span>Vol: <strong className="text-[#f1f5f9]">{currentHover.volume.toLocaleString()}</strong></span>}
            {showSma20 && currentHover.sma20 && (
              <span className="text-[#22d3ee]">SMA20: {stock.currency}{currentHover.sma20}</span>
            )}
            {showSma50 && currentHover.sma50 && (
              <span className="text-[#a78bfa]">SMA50: {stock.currency}{currentHover.sma50}</span>
            )}
            {showEma20 && currentHover.ema20 && (
              <span className="text-[#f59e0b]">EMA20: {stock.currency}{currentHover.ema20}</span>
            )}
          </div>
        </div>
      )}

      {/* Interactive SVG Chart Canvas */}
      <div className="relative w-full h-72 sm:h-80 bg-[#070d19] rounded-xl border border-[#1e293b] p-3 overflow-hidden select-none">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#22d3ee] animate-spin" />
            <span className="text-[12px] font-mono text-[#94a3b8]">Streaming institutional market candles...</span>
          </div>
        ) : (
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 320"
            preserveAspectRatio="none"
            onMouseLeave={() => setHoveredCandle(null)}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines and Price Axis */}
            {[0.2, 0.4, 0.6, 0.8].map((pct, idx) => {
              const y = 300 * pct;
              const priceAtLevel = maxPrice - (maxPrice - minPrice) * pct;
              return (
                <g key={idx}>
                  <line
                    x1="0"
                    y1={y}
                    x2="800"
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="795"
                    y={y - 4}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {stock.currency}{priceAtLevel.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Scale functions */}
            {(() => {
              const totalCandles = candleData.length;
              const candleWidth = Math.max(3, (800 / totalCandles) * 0.6);
              const stepX = 800 / totalCandles;

              const getY = (val: number) => {
                const ratio = (val - minPrice) / (maxPrice - minPrice || 1);
                return 270 - ratio * 240;
              };

              // Points for line chart
              const linePoints = candleData
                .map((c, i) => `${i * stepX + stepX / 2},${getY(c.close)}`)
                .join(' ');

              // SMA 20 line
              const sma20Points = candleData
                .filter((c) => c.sma20)
                .map((c, i) => `${i * stepX + stepX / 2},${getY(c.sma20!)}`)
                .join(' ');

              // SMA 50 line
              const sma50Points = candleData
                .filter((c) => c.sma50)
                .map((c, i) => `${i * stepX + stepX / 2},${getY(c.sma50!)}`)
                .join(' ');

              // EMA 20 line
              const ema20Points = candleData
                .filter((c) => c.ema20)
                .map((c, i) => `${i * stepX + stepX / 2},${getY(c.ema20!)}`)
                .join(' ');

              return (
                <>
                  {/* Volume Bars */}
                  {showVolume &&
                    candleData.map((c, i) => {
                      const x = i * stepX + (stepX - candleWidth) / 2;
                      const volHeight = Math.max(4, (c.volume / (maxVolume || 1)) * 60);
                      const isUp = c.close >= c.open;
                      return (
                        <rect
                          key={`vol-${i}`}
                          x={x}
                          y={300 - volHeight}
                          width={candleWidth}
                          height={volHeight}
                          fill={isUp ? '#10b981' : '#ef4444'}
                          opacity="0.25"
                        />
                      );
                    })}

                  {/* Candlesticks */}
                  {chartType === 'candlestick' &&
                    candleData.map((c, i) => {
                      const isUp = c.close >= c.open;
                      const candleColor = isUp ? '#10b981' : '#ef4444';
                      const xCenter = i * stepX + stepX / 2;
                      const yOpen = getY(c.open);
                      const yClose = getY(c.close);
                      const yHigh = getY(c.high);
                      const yLow = getY(c.low);

                      const bodyTop = Math.min(yOpen, yClose);
                      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                      return (
                        <g
                          key={`candle-${i}`}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredCandle(c)}
                        >
                          {/* Upper & lower wick */}
                          <line
                            x1={xCenter}
                            y1={yHigh}
                            x2={xCenter}
                            y2={yLow}
                            stroke={candleColor}
                            strokeWidth="1.2"
                          />
                          {/* Candle body */}
                          <rect
                            x={xCenter - candleWidth / 2}
                            y={bodyTop}
                            width={candleWidth}
                            height={bodyHeight}
                            fill={candleColor}
                            rx="1"
                          />
                        </g>
                      );
                    })}

                  {/* Line Chart option */}
                  {chartType === 'line' && (
                    <>
                      {/* Area fill */}
                      <polygon
                        points={`0,300 ${linePoints} 800,300`}
                        fill="url(#areaGradient)"
                      />
                      {/* Line stroke */}
                      <polyline
                        points={linePoints}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}

                  {/* Technical Overlay: SMA20 */}
                  {showSma20 && sma20Points && (
                    <polyline
                      points={sma20Points}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  )}

                  {/* Technical Overlay: SMA50 */}
                  {showSma50 && sma50Points && (
                    <polyline
                      points={sma50Points}
                      fill="none"
                      stroke="#a78bfa"
                      strokeWidth="1.5"
                      opacity="0.85"
                    />
                  )}

                  {/* Technical Overlay: EMA20 */}
                  {showEma20 && ema20Points && (
                    <polyline
                      points={ema20Points}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      opacity="0.85"
                    />
                  )}

                  {/* Hover vertical crosshair */}
                  {hoveredCandle && (
                    <line
                      x1={candleData.indexOf(hoveredCandle) * stepX + stepX / 2}
                      y1="0"
                      x2={candleData.indexOf(hoveredCandle) * stepX + stepX / 2}
                      y2="300"
                      stroke="#94a3b8"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  )}
                </>
              );
            })()}
          </svg>
        )}
      </div>

      {/* Technical Indicators Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
        <div className="bg-[#070d19] p-2.5 rounded-xl border border-[#1e293b]">
          <span className="text-[#64748b] block text-[10px]">RSI (14-DAY)</span>
          <span className="text-[#34d399] font-bold text-[13px]">{stock.rsi} (Bullish Momentum)</span>
        </div>
        <div className="bg-[#070d19] p-2.5 rounded-xl border border-[#1e293b]">
          <span className="text-[#64748b] block text-[10px]">MACD (12,26,9)</span>
          <span className="text-[#22d3ee] font-bold text-[13px]">{stock.macd}</span>
        </div>
        <div className="bg-[#070d19] p-2.5 rounded-xl border border-[#1e293b]">
          <span className="text-[#64748b] block text-[10px]">BOLLINGER STATUS</span>
          <span className="text-[#f1f5f9] font-bold text-[13px]">{stock.bollingerStatus}</span>
        </div>
        <div className="bg-[#070d19] p-2.5 rounded-xl border border-[#1e293b]">
          <span className="text-[#64748b] block text-[10px]">AVERAGE TRUE RANGE</span>
          <span className="text-[#f59e0b] font-bold text-[13px]">{stock.atrAmount}</span>
        </div>
      </div>
    </section>
  );
};

export default StockChartPanel;
