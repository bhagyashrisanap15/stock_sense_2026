export type TabType =
  | 'dashboard'
  | 'predictions'
  | 'risk-matrix'
  | 'xai-explainability'
  | 'watchlist'
  | 'news-sentiment'
  | 'portfolio'
  | 'settings'
  | 'terminal-hub';

export type TimeHorizon = 'Next Day' | '5 Days' | '1 Month' | '3 Months';

export type ChartRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

export type ChartType = 'candlestick' | 'line';

export interface CandleDataPoint {
  timestamp: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  ema20?: number;
  upperBand?: number;
  lowerBand?: number;
}

export interface MarketIndexOverview {
  symbol: string;
  name: string;
  value: string;
  numericValue: number;
  change: string;
  changePercent: string;
  numericChange: number;
  numericChangePercent: number;
  isPositive: boolean;
  marketStatus: 'OPEN' | 'CLOSED';
  region: 'INDIA' | 'US' | 'GLOBAL';
  source: string;
  lastUpdated: string;
  high24h?: string;
  low24h?: string;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  priceFormatted: string;
  change: number;
  changePercent: number;
  isPositive: boolean;
  market?: string;
}

export interface ShapFactor {
  name: string;
  badge: string;
  value: number; // positive driver or negative drag
  rawFormatted: string;
  description: string;
  isDrag?: boolean;
}

export interface ScenarioSimulation {
  title: string;
  type: 'bull' | 'base' | 'bear';
  probability: number;
  description: string;
  targetOrBand: string;
  riskRewardOrStrategy: string;
}

export interface ConfirmationIndicator {
  id: string;
  name: string;
  status: string;
  isBullish: boolean;
  type?: 'positive' | 'warning' | 'neutral';
}

export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  priceFormatted: string;
  change: number;
  changePercent: number;
  volume: string;
  marketOpen: boolean;
  
  // Scores
  trendScore: number;
  finbertSentiment: number;
  riskScore: number;
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH';
  sharpeRatio: number;
  sortinoRatio: number;
  confidence: number;
  
  // Forecast
  forecastDirection: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  expectedDelta: string;
  targetRange: string;
  probabilities: {
    bullish: number;
    neutral: number;
    bearish: number;
  };
  invalidationLevel: string;
  resistanceLevel: string;
  
  // Risk breakdown
  volatilityAnn: number;
  maxDrawdown: number;
  var95: number;
  varAmount: string;
  beta: number;
  downsideDev: number;
  atr14: number;
  atrAmount: string;
  
  // Factor scores (1 to 5)
  factors: {
    volatility: { score: number; label: string };
    drawdown: { score: number; label: string };
    tailRisk: { score: number; label: string };
    marketBeta: { score: number; label: string };
    liquidity: { score: number; label: string };
  };

  // Indicators
  rsi: number;
  macd: string;
  bollingerStatus: string;
  confirmationChecklist: ConfirmationIndicator[];

  // SHAP Attributions
  baselineLogOdds: number;
  finalLogOdds: number;
  netShap: string;
  shapFactors: ShapFactor[];
  
  // Scenarios
  scenarios: ScenarioSimulation[];

  // Explanations
  technicalNarrative: string;
  eli5Narrative: string;
  vivaVaRLogic: string;
  vivaBetaLogic: string;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  exchange: string;
  qty: number;
  avgBuy: number;
  avgBuyFormatted: string;
  curPrice: number;
  curPriceFormatted: string;
  curValue: number;
  curValueFormatted: string;
  pnlPercent: number;
  pnlFormatted: string;
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  directionProb: number;
  riskVector: string;
  riskVectorColor: 'Low' | 'Med' | 'High';
  shapDriver: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  upperThreshold?: number; // Target price (trigger when price >= upperThreshold)
  lowerThreshold?: number; // Stop-loss price (trigger when price <= lowerThreshold)
  enabled: boolean;
  createdAt: string;
  note?: string;
  strategyTag?: 'Target Profit' | 'Stop Loss' | 'Breakout Alert' | 'Support Watch' | 'Custom';
  isTriggered?: boolean;
  triggeredMessage?: string;
  triggeredAt?: string;
  currency?: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  exchange: string;
  emoji: string;
  price: string;
  change: string;
  isPositive: boolean;
  mlDirection: string;
  riskVector: string;
  xaiSignal: string;
  attention: string;
  alert?: PriceAlert;
}

export interface NewsSentimentItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  score: number;
  url?: string;
  finbertTag?: string;
}

export interface SentimentData {
  symbol: string;
  overallSentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  sentimentScore: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  sampleSize: number;
  model: string;
  lastUpdated: string;
  headlines: NewsSentimentItem[];
  shapImpactNote: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  stockName: string;
  exchange: string;
  currency: string;
  condition: 'GREATER_THAN' | 'LESS_THAN';
  targetPrice: number;
  currentPrice: number;
  createdAt: string;
  active: boolean;
  triggered: boolean;
  triggeredAt?: string;
  triggeredPrice?: number;
  note?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  type: 'alert' | 'bull' | 'bear' | 'warning';
  symbol?: string;
  isRead: boolean;
  alertId?: string;
}

