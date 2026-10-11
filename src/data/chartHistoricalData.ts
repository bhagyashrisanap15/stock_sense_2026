import { CandleDataPoint, ChartRange } from '../types/stock';

/**
 * Generate synthetic realistic OHLCV price series for each timeframe and base stock price
 */
export function generateCandleSeries(
  basePrice: number,
  range: ChartRange,
  trendDirection: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'BULLISH'
): CandleDataPoint[] {
  let count = 30;
  let timeIntervalMinutes = 15;
  let volatility = basePrice * 0.008;

  switch (range) {
    case '1D':
      count = 26; // 6.5 hours of trading (15 min candles)
      timeIntervalMinutes = 15;
      volatility = basePrice * 0.004;
      break;
    case '1W':
      count = 35; // 7 intervals per day x 5 days
      timeIntervalMinutes = 60;
      volatility = basePrice * 0.008;
      break;
    case '1M':
      count = 22; // 22 trading sessions
      timeIntervalMinutes = 1440;
      volatility = basePrice * 0.015;
      break;
    case '3M':
      count = 60;
      timeIntervalMinutes = 1440;
      volatility = basePrice * 0.022;
      break;
    case '6M':
      count = 120;
      timeIntervalMinutes = 1440;
      volatility = basePrice * 0.03;
      break;
    case '1Y':
      count = 100;
      timeIntervalMinutes = 2880;
      volatility = basePrice * 0.04;
      break;
  }

  const result: CandleDataPoint[] = [];
  const now = new Date();
  const startTime = new Date(now.getTime() - count * timeIntervalMinutes * 60 * 1000);

  // Determine drift based on trend
  const driftPerCandle =
    trendDirection === 'BULLISH'
      ? (basePrice * 0.06) / count
      : trendDirection === 'BEARISH'
      ? -(basePrice * 0.06) / count
      : 0;

  // Start from baseline price minus cumulative drift so current ends near basePrice
  let currentClose = basePrice - driftPerCandle * count;

  for (let i = 0; i < count; i++) {
    const candleTime = new Date(startTime.getTime() + i * timeIntervalMinutes * 60 * 1000);
    const open = currentClose;
    const randomShock = (Math.sin(i * 0.45) + (Math.random() - 0.48)) * volatility;
    const close = Math.max(open * 0.5, open + driftPerCandle + randomShock);
    const high = Math.max(open, close) + Math.random() * (volatility * 0.6);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.6);
    const volume = Math.floor(40000 + Math.random() * 85000 + (Math.abs(close - open) / open) * 200000);

    currentClose = close;

    result.push({
      timestamp: candleTime.toISOString(),
      date:
        range === '1D'
          ? candleTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : candleTime.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
  }

  // Calculate moving averages: SMA20, SMA50, EMA20
  for (let i = 0; i < result.length; i++) {
    // SMA20
    const sma20Window = result.slice(Math.max(0, i - 19), i + 1);
    const sma20Val = sma20Window.reduce((acc, c) => acc + c.close, 0) / sma20Window.length;
    result[i].sma20 = Number(sma20Val.toFixed(2));

    // SMA50
    const sma50Window = result.slice(Math.max(0, i - 49), i + 1);
    const sma50Val = sma50Window.reduce((acc, c) => acc + c.close, 0) / sma50Window.length;
    result[i].sma50 = Number(sma50Val.toFixed(2));

    // EMA20
    if (i === 0) {
      result[i].ema20 = result[i].close;
    } else {
      const k = 2 / (20 + 1);
      const prevEma = result[i - 1].ema20 || result[i - 1].close;
      result[i].ema20 = Number((result[i].close * k + prevEma * (1 - k)).toFixed(2));
    }
  }

  // Ensure last candle close is tied to basePrice
  if (result.length > 0) {
    const last = result[result.length - 1];
    last.close = basePrice;
    last.high = Math.max(last.high, basePrice);
    last.low = Math.min(last.low, basePrice);
  }

  return result;
}
