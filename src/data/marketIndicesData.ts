import { MarketIndexOverview, StockData } from '../types/stock';

export interface MarketOverviewItem {
  id: string;
  name: string;
  symbol: string;
  exchange: string;
  value: string;
  numericValue: number;
  change: string;
  changePercent: string;
  numericChange: number;
  isPositive: boolean;
  marketStatus: 'OPEN' | 'CLOSED';
  source: string;
  lastUpdated: string;
  isCustomStock?: boolean;
}

export const INITIAL_MARKET_INDICES: MarketOverviewItem[] = [
  {
    id: 'nifty-50',
    name: 'NIFTY 50',
    symbol: 'NIFTY',
    exchange: 'NSE',
    value: '22,410.80',
    numericValue: 22410.8,
    change: '+182.40',
    changePercent: '+0.82%',
    numericChange: 182.4,
    isPositive: true,
    marketStatus: 'OPEN',
    source: 'NSE India Feed',
    lastUpdated: '12s ago',
  },
  {
    id: 'sensex',
    name: 'SENSEX',
    symbol: 'SENSEX',
    exchange: 'BSE',
    value: '73,876.80',
    numericValue: 73876.8,
    change: '+564.20',
    changePercent: '+0.77%',
    numericChange: 564.2,
    isPositive: true,
    marketStatus: 'OPEN',
    source: 'BSE Direct',
    lastUpdated: '18s ago',
  },
  {
    id: 'sp-500',
    name: 'S&P 500',
    symbol: 'SPX',
    exchange: 'CBOE',
    value: '5,147.20',
    numericValue: 5147.2,
    change: '+28.30',
    changePercent: '+0.55%',
    numericChange: 28.3,
    isPositive: true,
    marketStatus: 'CLOSED',
    source: 'CBOE Real-Time',
    lastUpdated: 'Closed (16:00 EST)',
  },
  {
    id: 'nasdaq',
    name: 'NASDAQ',
    symbol: 'IXIC',
    exchange: 'NASDAQ',
    value: '16,388.24',
    numericValue: 16388.24,
    change: '+152.10',
    changePercent: '+0.94%',
    numericChange: 152.1,
    isPositive: true,
    marketStatus: 'CLOSED',
    source: 'NASDAQ Composite',
    lastUpdated: 'Closed (16:00 EST)',
  },
];

export const getSelectedStockOverviewItem = (stock: StockData): MarketOverviewItem => {
  return {
    id: `stock-${stock.symbol}`,
    name: stock.name,
    symbol: stock.symbol,
    exchange: stock.exchange,
    value: `${stock.currency}${stock.price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    numericValue: stock.price,
    change: `${stock.change >= 0 ? '+' : ''}${stock.currency}${stock.change.toFixed(2)}`,
    changePercent: `${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`,
    numericChange: stock.change,
    isPositive: stock.change >= 0,
    marketStatus: stock.marketOpen ? 'OPEN' : 'CLOSED',
    source: `${stock.exchange} Live Quote`,
    lastUpdated: 'Real-time Tick',
    isCustomStock: true,
  };
};
