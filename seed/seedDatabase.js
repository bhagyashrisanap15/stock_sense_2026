/**
 * StockSense AI - Complete MongoDB Atlas Database Seed Script
 * Final-Year Engineering Project
 * 
 * Usage:
 *   node seed/seedDatabase.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Fail fast if database is unreachable, do not hang buffering operations
mongoose.set('bufferCommands', false);

import {
  User,
  Stock,
  HistoricalPrice,
  TechnicalIndicator,
  Prediction,
  RiskAssessment,
  AIAnalysis,
  SentimentAnalysis,
  Watchlist,
  Portfolio,
  PortfolioHolding,
  Alert,
  PredictionHistory,
  ModelPerformance,
  MarketRegime,
  Report,
} from '../server/models/index.js';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stockSenseAI';

// Date utility
const daysAgo = (days) => {
  const d = new Date('2026-10-01T09:15:00.000Z');
  d.setDate(d.getDate() - days);
  return d;
};

async function seedDatabase() {
  console.log('==================================================');
  console.log('StockSense AI Database Seed');
  console.log('==================================================\n');
  console.log('Connecting to MongoDB Atlas...');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.\n');
    console.log(`Database:\n${mongoose.connection.name || 'stockSenseAI'}\n`);

    // 1. Clear ONLY the collections belonging to StockSense AI
    await Promise.all([
      User.deleteMany({}),
      Stock.deleteMany({}),
      HistoricalPrice.deleteMany({}),
      TechnicalIndicator.deleteMany({}),
      Prediction.deleteMany({}),
      RiskAssessment.deleteMany({}),
      AIAnalysis.deleteMany({}),
      SentimentAnalysis.deleteMany({}),
      Watchlist.deleteMany({}),
      Portfolio.deleteMany({}),
      PortfolioHolding.deleteMany({}),
      Alert.deleteMany({}),
      PredictionHistory.deleteMany({}),
      ModelPerformance.deleteMany({}),
      MarketRegime.deleteMany({}),
      Report.deleteMany({}),
    ]);

    // 2. Insert Users
    console.log('Inserting users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('StockSenseSecurePass2026!', salt);

    const usersData = [
      {
        name: 'Bhagyashri Sanap',
        email: 'bhagyashri@example.com',
        passwordHash: hashedPassword,
        role: 'admin',
        watchlist: ['TCS', 'RELIANCE', 'INFY', 'AAPL'],
        preferences: {
          theme: 'dark',
          defaultMarket: 'NSE',
          defaultPredictionHorizon: '5D',
          engineeringVivaMode: true,
        },
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun.mehta@example.com',
        passwordHash: hashedPassword,
        role: 'analyst',
        watchlist: ['NVDA', 'TSLA', 'AAPL', 'MSFT'],
        preferences: {
          theme: 'dark',
          defaultMarket: 'NASDAQ',
          defaultPredictionHorizon: '1M',
          engineeringVivaMode: true,
        },
      },
      {
        name: 'Pooja Kulkarni',
        email: 'pooja.kulkarni@example.com',
        passwordHash: hashedPassword,
        role: 'user',
        watchlist: ['HDFCBANK', 'ICICIBANK', 'SBIN'],
        preferences: {
          theme: 'dark',
          defaultMarket: 'NSE',
          defaultPredictionHorizon: '5D',
          engineeringVivaMode: false,
        },
      },
    ];

    const insertedUsers = await User.insertMany(usersData);
    console.log(`✓ ${insertedUsers.length} users inserted\n`);

    const primaryUserId = insertedUsers[0]._id;
    const secondUserId = insertedUsers[1]._id;

    // 3. Insert Stocks (8 Indian + 6 International = 14 stocks)
    console.log('Inserting stocks...');
    const stocksData = [
      // Indian Stocks (NSE)
      {
        symbol: 'TCS',
        companyName: 'Tata Consultancy Services',
        exchange: 'NSE',
        sector: 'Information Technology',
        industry: 'IT Services & Consulting',
        currency: 'INR',
        market: 'India',
        description: 'Global leader in IT services, digital and business solutions.',
        marketCapCategory: 'LARGE_CAP',
        isActive: true,
      },
      {
        symbol: 'RELIANCE',
        companyName: 'Reliance Industries Limited',
        exchange: 'NSE',
        sector: 'Energy & Conglomerate',
        industry: 'Oil, Retail & Telecom',
        currency: 'INR',
        market: 'India',
        description: 'Energy, petrochemicals, natural gas, retail, and digital services conglomerate.',
        marketCapCategory: 'LARGE_CAP',
        isActive: true,
      },
      {
        symbol: 'INFY',
        companyName: 'Infosys Limited',
        exchange: 'NSE',
        sector: 'Information Technology',
        industry: 'IT Services & Software',
        currency: 'INR',
        market: 'India',
        description: 'Next-generation digital services and consulting multinational corporation.',
        marketCapCategory: 'LARGE_CAP',
        isActive: true,
      },
      {
        symbol: 'HDFCBANK',
        companyName: 'HDFC Bank Limited',
        exchange: 'NSE',
        sector: 'Financial Services',
        industry: 'Private Banking',
        currency: 'INR',
        market: 'India',
        description: 'Largest private sector bank in India offering comprehensive commercial banking services.',
        marketCapCategory: 'LARGE_CAP',
        isActive: true,
      },
      {
        symbol: 'ICICIBANK',
        companyName: 'ICICI Bank Limited',
        exchange: 'NSE',
        sector: 'Financial Services',
        industry: 'Private Banking',
        currency: 'INR',
        market: 'India',
        description: 'Major private banking institution offering diversified financial services.',
        marketCapCategory: 'LARGE_CAP',
        isActive: true,
      },
      {
        symbol: 'SBIN',
        companyName: 'State Bank of India',
        exchange: 'NSE',
        sector: 'Financial Services',
        industry: 'Public Sector Banking',
        currency: 'INR',
        market: 'India',
        description: 'Largest public sector bank and statutory financial services institution in India.',
        marketCapCategory: 'LARGE_CAP',
        isActive: true,
      },
      {
        symbol: 'ITC',
        companyName: 'ITC Limited',
        exchange: 'NSE',
        sector: 'Consumer Goods',
        industry: 'FMCG, Hotels & Paper',
        currency: 'INR',
        market: 'India',
        description: 'Diversified conglomerate with presence in FMCG, hotels, packaging, and agri-business.',
        marketCapCategory: 'LARGE_CAP',
        isActive: true,
      },
      {
        symbol: 'LT',
        companyName: 'Larsen & Toubro Limited',
        exchange: 'NSE',
        sector: 'Capital Goods',
        industry: 'Engineering & Construction',
        currency: 'INR',
        market: 'India',
        description: 'Indian multinational engaged in EPC projects, hi-tech manufacturing, and infrastructure services.',
        marketCapCategory: 'LARGE_CAP',
        isActive: true,
      },
      // International Stocks (NASDAQ / NYSE)
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        exchange: 'NASDAQ',
        sector: 'Consumer Electronics',
        industry: 'Technology & Hardware',
        currency: 'USD',
        market: 'United States',
        description: 'Designs, manufactures, and markets smartphones, personal computers, and digital services.',
        marketCapCategory: 'MEGA_CAP',
        isActive: true,
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        exchange: 'NASDAQ',
        sector: 'Software & Cloud',
        industry: 'Infrastructure & Enterprise Software',
        currency: 'USD',
        market: 'United States',
        description: 'Developer of enterprise software, cloud computing (Azure), and gaming solutions.',
        marketCapCategory: 'MEGA_CAP',
        isActive: true,
      },
      {
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        exchange: 'NASDAQ',
        sector: 'Communication Services',
        industry: 'Internet Content & Cloud',
        currency: 'USD',
        market: 'United States',
        description: 'Parent company of Google, YouTube, Android, Google Cloud, and AI initiatives.',
        marketCapCategory: 'MEGA_CAP',
        isActive: true,
      },
      {
        symbol: 'AMZN',
        companyName: 'Amazon.com Inc.',
        exchange: 'NASDAQ',
        sector: 'Consumer Discretionary',
        industry: 'E-commerce & Cloud Infrastructure',
        currency: 'USD',
        market: 'United States',
        description: 'Global e-commerce marketplace and leading cloud computing platform (AWS).',
        marketCapCategory: 'MEGA_CAP',
        isActive: true,
      },
      {
        symbol: 'TSLA',
        companyName: 'Tesla Inc.',
        exchange: 'NASDAQ',
        sector: 'Automotive',
        industry: 'Electric Vehicles & Clean Energy',
        currency: 'USD',
        market: 'United States',
        description: 'Electric vehicle manufacturer, battery energy storage systems, and autonomy AI software.',
        marketCapCategory: 'MEGA_CAP',
        isActive: true,
      },
      {
        symbol: 'NVDA',
        companyName: 'NVIDIA Corporation',
        exchange: 'NASDAQ',
        sector: 'Semiconductors',
        industry: 'AI Hardware & Accelerators',
        currency: 'USD',
        market: 'United States',
        description: 'Pioneer of GPUs and high-performance accelerated computing systems powering generative AI.',
        marketCapCategory: 'MEGA_CAP',
        isActive: true,
      },
    ];

    const insertedStocks = await Stock.insertMany(stocksData);
    console.log(`✓ ${insertedStocks.length} stocks inserted\n`);

    // 4. Insert Historical Prices (12 trading days for each of the 14 stocks = 168 records)
    console.log('Inserting historical prices...');
    const historicalPriceRecords = [];

    // Base price anchor lookup
    const basePrices = {
      TCS: 3920,
      RELIANCE: 2905,
      INFY: 1520,
      HDFCBANK: 1445,
      ICICIBANK: 1180,
      SBIN: 810,
      ITC: 495,
      LT: 3620,
      AAPL: 188.5,
      MSFT: 422.0,
      GOOGL: 168.0,
      AMZN: 184.0,
      TSLA: 178.0,
      NVDA: 885.0,
    };

    stocksData.forEach((stock) => {
      let currentPrice = basePrices[stock.symbol] || 1000;
      for (let day = 14; day >= 1; day--) {
        // Skip weekend simulation (2 out of 7 days)
        if (day % 7 === 0 || day % 7 === 6) continue;

        const jitter = (Math.sin(day) * 0.015) + ((day % 3 === 0 ? 0.008 : -0.004));
        const close = Number((currentPrice * (1 + jitter)).toFixed(2));
        const high = Number((close * 1.012).toFixed(2));
        const low = Number((close * 0.989).toFixed(2));
        const open = Number((low + (high - low) * 0.45).toFixed(2));
        const volume = Math.floor(1500000 + Math.abs(Math.sin(day)) * 3200000);

        historicalPriceRecords.push({
          symbol: stock.symbol,
          date: daysAgo(day),
          open,
          high,
          low,
          close,
          adjustedClose: close,
          volume,
          dataSource: 'DEMO',
        });
        currentPrice = close;
      }
    });

    const insertedPrices = await HistoricalPrice.insertMany(historicalPriceRecords);
    console.log(`✓ ${insertedPrices.length} historical price records inserted\n`);

    // 5. Insert Technical Indicators
    console.log('Inserting technical indicators...');
    const technicalIndicatorRecords = [
      {
        symbol: 'TCS',
        date: daysAgo(1),
        sma20: 3895.50,
        sma50: 3840.20,
        sma200: 3680.10,
        ema20: 3910.40,
        ema50: 3862.10,
        rsi: 64.2,
        macd: 38.5,
        macdSignal: 31.2,
        macdHistogram: 7.3,
        bollingerUpper: 3985.4,
        bollingerMiddle: 3895.5,
        bollingerLower: 3805.6,
        atr: 42.8,
        obv: 18450000,
        stochastic: 74.2,
        trendSignal: 'BULLISH',
        dataSource: 'DEMO',
      },
      {
        symbol: 'RELIANCE',
        date: daysAgo(1),
        sma20: 2880.20,
        sma50: 2845.60,
        sma200: 2710.00,
        ema20: 2895.40,
        ema50: 2860.10,
        rsi: 61.5,
        macd: 28.4,
        macdSignal: 22.1,
        macdHistogram: 6.3,
        bollingerUpper: 2960.0,
        bollingerMiddle: 2880.2,
        bollingerLower: 2800.4,
        atr: 36.5,
        obv: 34200000,
        stochastic: 68.4,
        trendSignal: 'BULLISH',
        dataSource: 'DEMO',
      },
      {
        symbol: 'INFY',
        date: daysAgo(1),
        sma20: 1505.20,
        sma50: 1480.10,
        sma200: 1420.50,
        ema20: 1515.60,
        ema50: 1492.40,
        rsi: 59.4,
        macd: 14.8,
        macdSignal: 11.2,
        macdHistogram: 3.6,
        bollingerUpper: 1555.0,
        bollingerMiddle: 1505.2,
        bollingerLower: 1455.4,
        atr: 21.4,
        obv: 21500000,
        stochastic: 62.1,
        trendSignal: 'BULLISH',
        dataSource: 'DEMO',
      },
      {
        symbol: 'HDFCBANK',
        date: daysAgo(1),
        sma20: 1452.10,
        sma50: 1465.40,
        sma200: 1510.20,
        ema20: 1448.20,
        ema50: 1458.00,
        rsi: 51.2,
        macd: 2.1,
        macdSignal: 1.8,
        macdHistogram: 0.3,
        bollingerUpper: 1485.0,
        bollingerMiddle: 1452.1,
        bollingerLower: 1419.2,
        atr: 18.2,
        obv: 45000000,
        stochastic: 50.4,
        trendSignal: 'NEUTRAL',
        dataSource: 'DEMO',
      },
      {
        symbol: 'AAPL',
        date: daysAgo(1),
        sma20: 186.20,
        sma50: 182.40,
        sma200: 174.10,
        ema20: 187.80,
        ema50: 184.20,
        rsi: 66.8,
        macd: 3.42,
        macdSignal: 2.65,
        macdHistogram: 0.77,
        bollingerUpper: 192.5,
        bollingerMiddle: 186.2,
        bollingerLower: 179.9,
        atr: 2.85,
        obv: 142000000,
        stochastic: 78.5,
        trendSignal: 'BULLISH',
        dataSource: 'DEMO',
      },
      {
        symbol: 'NVDA',
        date: daysAgo(1),
        sma20: 865.40,
        sma50: 820.10,
        sma200: 690.50,
        ema20: 880.20,
        ema50: 842.60,
        rsi: 71.4,
        macd: 24.6,
        macdSignal: 18.2,
        macdHistogram: 6.4,
        bollingerUpper: 925.0,
        bollingerMiddle: 865.4,
        bollingerLower: 805.8,
        atr: 28.5,
        obv: 98000000,
        stochastic: 82.3,
        trendSignal: 'BULLISH',
        dataSource: 'DEMO',
      },
      {
        symbol: 'TSLA',
        date: daysAgo(1),
        sma20: 184.50,
        sma50: 192.10,
        sma200: 215.40,
        ema20: 181.20,
        ema50: 188.40,
        rsi: 48.2,
        macd: -2.85,
        macdSignal: -1.90,
        macdHistogram: -0.95,
        bollingerUpper: 196.0,
        bollingerMiddle: 184.5,
        bollingerLower: 173.0,
        atr: 9.80,
        obv: 62000000,
        stochastic: 44.5,
        trendSignal: 'BEARISH',
        dataSource: 'DEMO',
      },
    ];

    // Seed remaining stocks with realistic baseline values
    ['ICICIBANK', 'SBIN', 'ITC', 'LT', 'MSFT', 'GOOGL', 'AMZN'].forEach((sym) => {
      const price = basePrices[sym];
      technicalIndicatorRecords.push({
        symbol: sym,
        date: daysAgo(1),
        sma20: Number((price * 0.99).toFixed(2)),
        sma50: Number((price * 0.975).toFixed(2)),
        sma200: Number((price * 0.93).toFixed(2)),
        ema20: Number((price * 0.995).toFixed(2)),
        ema50: Number((price * 0.98).toFixed(2)),
        rsi: 58.6,
        macd: Number((price * 0.008).toFixed(2)),
        macdSignal: Number((price * 0.006).toFixed(2)),
        macdHistogram: Number((price * 0.002).toFixed(2)),
        bollingerUpper: Number((price * 1.035).toFixed(2)),
        bollingerMiddle: price,
        bollingerLower: Number((price * 0.965).toFixed(2)),
        atr: Number((price * 0.016).toFixed(2)),
        obv: 24000000,
        stochastic: 64.0,
        trendSignal: 'BULLISH',
        dataSource: 'DEMO',
      });
    });

    const insertedIndicators = await TechnicalIndicator.insertMany(technicalIndicatorRecords);
    console.log(`✓ ${insertedIndicators.length} technical indicator records inserted\n`);

    // 6. Insert Predictions (with SHAP TreeSHAP top features)
    console.log('Inserting predictions...');
    const predictionsData = [
      {
        symbol: 'TCS',
        prediction: 'BULLISH',
        probabilities: { bullish: 78, neutral: 14, bearish: 8 },
        confidence: 78,
        predictionHorizon: '5D',
        expectedDelta: '+1.6% to +3.4%',
        targetRange: '₹3,990 – ₹4,060',
        model: 'XGBoost',
        modelVersion: '2.4.0',
        topFeatures: [
          { feature: 'RSI (14-period)', value: 64.2, impact: 'POSITIVE', contribution: 0.28, description: 'Strong momentum, non-saturated overbought threshold' },
          { feature: 'MACD Histogram Cross', value: 7.3, impact: 'POSITIVE', contribution: 0.22, description: 'Bullish zero-line separation confirmed' },
          { feature: 'Price vs 50-day SMA', value: '+3.8%', impact: 'POSITIVE', contribution: 0.19, description: 'Ascending structural continuation' },
          { feature: '5D Relative Volume', value: 1.34, impact: 'POSITIVE', contribution: 0.15, description: 'Block delivery accumulation pattern' },
          { feature: 'FinBERT Sentiment', value: 0.74, impact: 'POSITIVE', contribution: 0.11, description: 'Positive commentary across IT earnings transcripts' },
          { feature: 'ATR Volatility Influx', value: 42.8, impact: 'NEGATIVE', contribution: -0.12, description: 'Intraday range dampens deterministic follow-through' },
          { feature: 'Drawdown Supply Wall', value: 4020, impact: 'NEGATIVE', contribution: -0.08, description: 'Historical profit-taking liquidity cluster' },
        ],
        predictionDate: daysAgo(1),
        dataSource: 'DEMO',
      },
      {
        symbol: 'RELIANCE',
        prediction: 'BULLISH',
        probabilities: { bullish: 82, neutral: 11, bearish: 7 },
        confidence: 82,
        predictionHorizon: '5D',
        expectedDelta: '+1.8% to +3.9%',
        targetRange: '₹2,960 – ₹3,025',
        model: 'XGBoost',
        modelVersion: '2.4.0',
        topFeatures: [
          { feature: 'GRM Refining Spread', value: '$11.8/bbl', impact: 'POSITIVE', contribution: 0.32, description: 'Refining crack spreads expanding' },
          { feature: 'Jio 5G ARPU Acceleration', value: '₹182 Avg', impact: 'POSITIVE', contribution: 0.24, description: 'Tariff stabilization accelerating telecom cash flow' },
          { feature: 'Crude Brent Volatility', value: '$85.20', impact: 'NEGATIVE', contribution: -0.10, description: 'Upstream oil price fluctuations' },
        ],
        predictionDate: daysAgo(1),
        dataSource: 'DEMO',
      },
      {
        symbol: 'INFY',
        prediction: 'BULLISH',
        probabilities: { bullish: 74, neutral: 18, bearish: 8 },
        confidence: 74,
        predictionHorizon: '5D',
        expectedDelta: '+1.4% to +3.0%',
        targetRange: '₹1,560 – ₹1,610',
        model: 'XGBoost',
        modelVersion: '2.4.0',
        topFeatures: [
          { feature: 'Large Deal TCV Renewal', value: '$3.2B TCV', impact: 'POSITIVE', contribution: 0.29, description: 'Multi-year enterprise software contracts' },
          { feature: 'Operating Margin Expansion', value: '21.4%', impact: 'POSITIVE', contribution: 0.21, description: 'Automated delivery cost optimization' },
          { feature: 'Discretionary Spend Headwind', value: 'BFSI', impact: 'NEGATIVE', contribution: -0.12, description: 'European client project deferral' },
        ],
        predictionDate: daysAgo(1),
        dataSource: 'DEMO',
      },
      {
        symbol: 'HDFCBANK',
        prediction: 'NEUTRAL',
        probabilities: { bullish: 29, neutral: 61, bearish: 10 },
        confidence: 61,
        predictionHorizon: '5D',
        expectedDelta: '-0.8% to +1.5%',
        targetRange: '₹1,420 – ₹1,475',
        model: 'XGBoost',
        modelVersion: '2.4.0',
        topFeatures: [
          { feature: 'Deposit Mobilization Rate', value: '18% YoY', impact: 'POSITIVE', contribution: 0.18, description: 'Retail deposit accretion absorbing legacy liabilities' },
          { feature: 'Cost of Funds Pressure', value: 'Elevated', impact: 'NEGATIVE', contribution: -0.15, description: 'Aggressive term deposit competition' },
        ],
        predictionDate: daysAgo(1),
        dataSource: 'DEMO',
      },
      {
        symbol: 'AAPL',
        prediction: 'BULLISH',
        probabilities: { bullish: 81, neutral: 12, bearish: 7 },
        confidence: 81,
        predictionHorizon: '5D',
        expectedDelta: '+2.1% to +4.5%',
        targetRange: '$193.00 – $198.50',
        model: 'XGBoost',
        modelVersion: '2.4.0',
        topFeatures: [
          { feature: 'Services Margin Resilience', value: '74.2%', impact: 'POSITIVE', contribution: 0.31, description: 'High margin recurring digital subscriptions' },
          { feature: 'Buyback Execution Rate', value: '$110B Cap', impact: 'POSITIVE', contribution: 0.20, description: 'Corporate treasury buying cushioning downside' },
          { feature: 'China Hardware Shipments', value: 'Restricted', impact: 'NEGATIVE', contribution: -0.11, description: 'Intense local smartphone competition' },
        ],
        predictionDate: daysAgo(1),
        dataSource: 'DEMO',
      },
      {
        symbol: 'NVDA',
        prediction: 'BULLISH',
        probabilities: { bullish: 89, neutral: 7, bearish: 4 },
        confidence: 89,
        predictionHorizon: '5D',
        expectedDelta: '+3.5% to +6.8%',
        targetRange: '$925.00 – $955.00',
        model: 'XGBoost',
        modelVersion: '2.4.0',
        topFeatures: [
          { feature: 'Data Center AI Demand', value: '+260% YoY', impact: 'POSITIVE', contribution: 0.48, description: 'Enterprise hardware orders booked 5 quarters out' },
          { feature: 'Gross Margin Power', value: '76.8%', impact: 'POSITIVE', contribution: 0.35, description: 'CUDA software ecosystem pricing dominance' },
          { feature: 'Foundry Packaging Bottleneck', value: 'TSMC CoWoS', impact: 'NEGATIVE', contribution: -0.16, description: 'Packaging throughput caps physical deliveries' },
        ],
        predictionDate: daysAgo(1),
        dataSource: 'DEMO',
      },
      {
        symbol: 'TSLA',
        prediction: 'BEARISH',
        probabilities: { bullish: 24, neutral: 28, bearish: 48 },
        confidence: 68,
        predictionHorizon: '5D',
        expectedDelta: '-2.4% to +1.2%',
        targetRange: '$168.00 – $184.00',
        model: 'XGBoost',
        modelVersion: '2.4.0',
        topFeatures: [
          { feature: 'Auto Gross Margin Compression', value: '16.4%', impact: 'NEGATIVE', contribution: -0.38, description: 'Repeated price cuts eroding operating profits' },
          { feature: 'China EV Competition', value: 'High Inflow', impact: 'NEGATIVE', contribution: -0.22, description: 'Price competition in major export arenas' },
          { feature: 'Megapack Energy Deployment', value: '4.1 GWh', impact: 'POSITIVE', contribution: 0.17, description: 'Utility-scale grid battery revenue growth' },
        ],
        predictionDate: daysAgo(1),
        dataSource: 'DEMO',
      },
    ];

    // Seed remaining 7 stocks
    ['ICICIBANK', 'SBIN', 'ITC', 'LT', 'MSFT', 'GOOGL', 'AMZN'].forEach((sym) => {
      predictionsData.push({
        symbol: sym,
        prediction: 'BULLISH',
        probabilities: { bullish: 75, neutral: 16, bearish: 9 },
        confidence: 75,
        predictionHorizon: '5D',
        expectedDelta: '+1.5% to +3.2%',
        targetRange: 'Consolidation Breakout',
        model: 'XGBoost',
        modelVersion: '2.4.0',
        topFeatures: [
          { feature: 'Earnings Revision Trend', value: '+8.4%', impact: 'POSITIVE', contribution: 0.25, description: 'Positive earnings revisions' },
          { feature: 'Sector Index Inflow', value: 'Strong', impact: 'POSITIVE', contribution: 0.18, description: 'Institutional sector allocation' },
        ],
        predictionDate: daysAgo(1),
        dataSource: 'DEMO',
      });
    });

    const insertedPredictions = await Prediction.insertMany(predictionsData);
    console.log(`✓ ${insertedPredictions.length} prediction records inserted\n`);

    // 7. Insert Risk Assessments
    console.log('Inserting risk assessments...');
    const riskAssessmentsData = [
      {
        symbol: 'TCS',
        riskScore: 62,
        riskLevel: 'HIGH', // 61-80 = HIGH per requested thresholds
        volatility: 0.184, // 18.4%
        maximumDrawdown: -0.142, // -14.2%
        valueAtRisk: -0.021, // -2.10%
        beta: 0.88,
        sharpeRatio: 1.74,
        sortinoRatio: 2.12,
        atr: 42.8,
        downsideDeviation: 0.098,
        assessmentPeriod: '1Y',
        dataSource: 'DEMO',
      },
      {
        symbol: 'RELIANCE',
        riskScore: 52,
        riskLevel: 'MEDIUM', // 31-60 = MEDIUM
        volatility: 0.171,
        maximumDrawdown: -0.124,
        valueAtRisk: -0.019,
        beta: 0.96,
        sharpeRatio: 1.86,
        sortinoRatio: 2.20,
        atr: 36.5,
        downsideDeviation: 0.089,
        assessmentPeriod: '1Y',
        dataSource: 'DEMO',
      },
      {
        symbol: 'INFY',
        riskScore: 41,
        riskLevel: 'MEDIUM',
        volatility: 0.178,
        maximumDrawdown: -0.135,
        valueAtRisk: -0.0195,
        beta: 0.91,
        sharpeRatio: 1.68,
        sortinoRatio: 2.04,
        atr: 21.4,
        downsideDeviation: 0.087,
        assessmentPeriod: '1Y',
        dataSource: 'DEMO',
      },
      {
        symbol: 'HDFCBANK',
        riskScore: 62,
        riskLevel: 'HIGH',
        volatility: 0.165,
        maximumDrawdown: -0.148,
        valueAtRisk: -0.0205,
        beta: 0.98,
        sharpeRatio: 1.48,
        sortinoRatio: 1.76,
        atr: 18.2,
        downsideDeviation: 0.088,
        assessmentPeriod: '1Y',
        dataSource: 'DEMO',
      },
      {
        symbol: 'AAPL',
        riskScore: 48,
        riskLevel: 'MEDIUM',
        volatility: 0.162,
        maximumDrawdown: -0.118,
        valueAtRisk: -0.0175,
        beta: 0.94,
        sharpeRatio: 2.05,
        sortinoRatio: 2.45,
        atr: 2.85,
        downsideDeviation: 0.084,
        assessmentPeriod: '1Y',
        dataSource: 'DEMO',
      },
      {
        symbol: 'NVDA',
        riskScore: 58,
        riskLevel: 'MEDIUM',
        volatility: 0.342,
        maximumDrawdown: -0.186,
        valueAtRisk: -0.034,
        beta: 1.62,
        sharpeRatio: 2.34,
        sortinoRatio: 2.88,
        atr: 28.5,
        downsideDeviation: 0.142,
        assessmentPeriod: '1Y',
        dataSource: 'DEMO',
      },
      {
        symbol: 'TSLA',
        riskScore: 74,
        riskLevel: 'HIGH',
        volatility: 0.445,
        maximumDrawdown: -0.284,
        valueAtRisk: -0.042,
        beta: 2.15,
        sharpeRatio: 1.12,
        sortinoRatio: 1.35,
        atr: 9.80,
        downsideDeviation: 0.182,
        assessmentPeriod: '1Y',
        dataSource: 'DEMO',
      },
    ];

    ['ICICIBANK', 'SBIN', 'ITC', 'LT', 'MSFT', 'GOOGL', 'AMZN'].forEach((sym) => {
      riskAssessmentsData.push({
        symbol: sym,
        riskScore: 45,
        riskLevel: 'MEDIUM',
        volatility: 0.19,
        maximumDrawdown: -0.13,
        valueAtRisk: -0.02,
        beta: 0.95,
        sharpeRatio: 1.70,
        sortinoRatio: 2.05,
        atr: 15.0,
        downsideDeviation: 0.09,
        assessmentPeriod: '1Y',
        dataSource: 'DEMO',
      });
    });

    const insertedRisks = await RiskAssessment.insertMany(riskAssessmentsData);
    console.log(`✓ ${insertedRisks.length} risk assessment records inserted\n`);

    // 8. Insert AI Analyses (Google Gemini AI XAI Syntheses)
    console.log('Inserting AI analyses...');
    const aiAnalysesData = [
      {
        symbol: 'TCS',
        summary: 'The stock shows positive technical momentum with moderate risk. The ML model currently favors a bullish trend.',
        trendAnalysis: {
          direction: 'BULLISH',
          confidence: 78,
          reasoning: 'Price is above major moving averages (SMA20 and SMA50) and MACD histogram momentum (+7.3) is in positive expansion.',
        },
        riskAnalysis: {
          level: 'MEDIUM',
          score: 62,
          reasoning: 'Beta of 0.88 establishes defensive characteristics, while 1-day 95% VaR is contained at -2.10%.',
        },
        technicalAnalysis: {
          rsi: '64.2 Bullish momentum without overbought exhaustion',
          macd: 'Positive zero-line separation confirmed on daily interval',
          movingAverage: 'Golden Cross pattern: SMA20 (3,895.50) > SMA50 (3,840.20)',
          volume: '1.25x 20-day average delivery volume accumulation',
        },
        modelExplanation: [
          'RSI (+0.28) contributed positively',
          'MACD (+0.22) contributed positively',
          'Price above SMA50 (+0.19) contributed positively',
          'Delivery volume spike (+0.15) contributed positively',
          'FinBERT sentiment (+0.11) contributed positively',
          'ATR volatility influx (-0.12) reduced net confidence',
          'Supply wall resistance (-0.08) reduced net confidence',
        ],
        sentimentAnalysis: {
          sentiment: 'POSITIVE',
          score: 0.74,
        },
        trendWarning: 'Watch ₹3,980 resistance level for potential exhaustion volume and localized RSI divergence.',
        bullCase: 'Clean breakout above ₹3,980 pivots onward to target ₹4,060 supported by delivery volume confirmation.',
        baseCase: 'Subdued sector dispersion results in range-bound trading oscillating closely between ₹3,910 and ₹3,960.',
        bearCase: 'Macro tech weakness invalidates near-term support, prompting re-examination of the 50-day SMA floor at ₹3,840.',
        keyRisks: [
          'Macro tech valuation pullbacks',
          'Overhead supply profit-taking wall near ₹4,020',
          'Unexpected currency swings in cross-currency contracts',
        ],
        keySignals: [
          'SMA 20 > SMA 50 Golden Cross',
          'FinBERT positive news score +0.74',
          'Relative delivery volume 1.34x',
        ],
        beginnerExplanation: 'The AI is confident TCS will climb because it is trading comfortably above its 50-day average trendline, institutional buyer demand has surged significantly over the last 5 sessions, and positive IT sector earnings sentiment is creating a powerful tailwind.',
        aiTrendIntelligenceScore: 81,
        generatedBy: 'Gemini AI',
        dataSource: 'DEMO',
      },
      {
        symbol: 'AAPL',
        summary: 'Institutional sponsorship and software ecosystem cash generation reinforce high-confidence upward momentum.',
        trendAnalysis: {
          direction: 'BULLISH',
          confidence: 81,
          reasoning: 'Stable buyback program and high-margin services CAGR support multiple expansion.',
        },
        riskAnalysis: {
          level: 'LOW',
          score: 48,
          reasoning: 'Lowest drawdowns in mega-cap technology with an exemplary Sharpe ratio of 2.05.',
        },
        technicalAnalysis: {
          rsi: '66.8 healthy continuation channel',
          macd: '+0.77 bullish histogram spread',
          movingAverage: 'Trading firmly above 20-day and 50-day EMA lines',
          volume: 'Consistent accumulation on dip sessions',
        },
        modelExplanation: [
          'Services gross margins (+0.31) top positive driver',
          'RSI structural uptrend (+0.25) second positive driver',
          'Share repurchase volume (+0.20) buffers drawdowns',
          'China market competitive headwinds (-0.11) drag',
        ],
        sentimentAnalysis: {
          sentiment: 'POSITIVE',
          score: 0.82,
        },
        trendWarning: 'Monitor $191.00 all-time high threshold for temporary supply absorption.',
        bullCase: 'Breakout above $191 targets $198.50 with robust institutional volume.',
        baseCase: 'Consolidation between $187 and $191 awaiting macroeconomic catalysts.',
        bearCase: 'Treasury yield spikes trigger retracement to $183.50 key support.',
        keyRisks: ['Antitrust regulatory reviews', 'China smartphone market share contest'],
        keySignals: ['Services revenue +14% YoY', 'Call option delta skew favorable'],
        beginnerExplanation: 'Apple has solid growth in its subscription services and regularly buys back its own stock, which creates strong support for higher prices.',
        aiTrendIntelligenceScore: 84,
        generatedBy: 'Gemini AI',
        dataSource: 'DEMO',
      },
    ];

    // Seed remaining stocks with realistic template
    ['RELIANCE', 'INFY', 'HDFCBANK', 'NVDA', 'TSLA', 'ICICIBANK', 'SBIN', 'ITC', 'LT', 'MSFT', 'GOOGL', 'AMZN'].forEach((sym) => {
      aiAnalysesData.push({
        symbol: sym,
        summary: `Machine learning models identify active momentum setup for ${sym} within its benchmark sector.`,
        trendAnalysis: {
          direction: sym === 'TSLA' ? 'BEARISH' : sym === 'HDFCBANK' ? 'NEUTRAL' : 'BULLISH',
          confidence: 76,
          reasoning: `Technical factors and order flow support current ${sym} trend vector.`,
        },
        riskAnalysis: {
          level: sym === 'TSLA' ? 'HIGH' : 'MEDIUM',
          score: sym === 'TSLA' ? 74 : 50,
          reasoning: 'Factor stress metrics remain within calibrated historical parameters.',
        },
        technicalAnalysis: {
          rsi: '58.5 Neutral-Bullish',
          macd: 'Positive histogram separation',
          movingAverage: 'Price holding above primary moving averages',
          volume: 'Institutional participation verified',
        },
        modelExplanation: ['Positive moving average divergence', 'Healthy risk-adjusted return ratio'],
        sentimentAnalysis: { sentiment: 'POSITIVE', score: 0.65 },
        trendWarning: `Observe immediate technical resistance for ${sym}.`,
        bullCase: 'Continuation towards upper Bollinger channel boundaries.',
        baseCase: 'Orderly consolidation within recent trading session brackets.',
        bearCase: 'Loss of 50-day moving average triggers risk management stops.',
        keyRisks: ['Systemic sector dispersion', 'Macro rate volatility'],
        keySignals: ['Positive relative volume', 'Firm support defense'],
        beginnerExplanation: `The model analyzes key indicators for ${sym} to calculate predictable trend probabilities.`,
        aiTrendIntelligenceScore: 78,
        generatedBy: 'Gemini AI',
        dataSource: 'DEMO',
      });
    });

    const insertedAIAnalyses = await AIAnalysis.insertMany(aiAnalysesData);
    console.log(`✓ ${insertedAIAnalyses.length} AI analysis records inserted\n`);

    // 9. Insert Sentiment Analyses
    console.log('Inserting sentiment analyses...');
    const sentimentAnalysesData = [
      {
        symbol: 'TCS',
        positive: 72,
        neutral: 18,
        negative: 10,
        sentimentScore: 0.74,
        overallSentiment: 'POSITIVE',
        headlines: [
          { title: 'TCS Expands Cloud Transformation Partnership With Global Tier-1 Insurer', sentiment: 'POSITIVE', score: 0.84, source: 'Demo Wire' },
          { title: 'Analysts Note Resilient Enterprise Deal Bookings in Indian IT Sector', sentiment: 'POSITIVE', score: 0.78, source: 'Demo Financial Wire' },
          { title: 'Discretionary Client IT Budgets Subject to Selective Scrutiny', sentiment: 'NEUTRAL', score: -0.05, source: 'Demo Tech News' },
        ],
        dataSource: 'DEMO',
        analysisDate: daysAgo(1),
      },
      {
        symbol: 'RELIANCE',
        positive: 70,
        neutral: 20,
        negative: 10,
        sentimentScore: 0.71,
        overallSentiment: 'POSITIVE',
        headlines: [
          { title: 'Refining Margins Expand on Robust Middle Distillate Crack Spreads', sentiment: 'POSITIVE', score: 0.82, source: 'Demo Energy Wire' },
          { title: 'Jio Adds Record 5G Subscribers Across Urban Circles', sentiment: 'POSITIVE', score: 0.79, source: 'Demo Telecom Watch' },
        ],
        dataSource: 'DEMO',
        analysisDate: daysAgo(1),
      },
      {
        symbol: 'AAPL',
        positive: 78,
        neutral: 14,
        negative: 8,
        sentimentScore: 0.82,
        overallSentiment: 'POSITIVE',
        headlines: [
          { title: 'Apple Services Segment Generates Record Operating Margins', sentiment: 'POSITIVE', score: 0.88, source: 'Demo Tech Daily' },
          { title: 'Institutional Fund Flows Show Sustained Tech Mega-Cap Accumulation', sentiment: 'POSITIVE', score: 0.81, source: 'Demo Market Pulse' },
        ],
        dataSource: 'DEMO',
        analysisDate: daysAgo(1),
      },
    ];

    ['INFY', 'HDFCBANK', 'NVDA', 'TSLA', 'ICICIBANK', 'SBIN', 'ITC', 'LT', 'MSFT', 'GOOGL', 'AMZN'].forEach((sym) => {
      sentimentAnalysesData.push({
        symbol: sym,
        positive: sym === 'TSLA' ? 38 : 68,
        neutral: sym === 'TSLA' ? 24 : 20,
        negative: sym === 'TSLA' ? 38 : 12,
        sentimentScore: sym === 'TSLA' ? 0.15 : 0.68,
        overallSentiment: sym === 'TSLA' ? 'NEUTRAL' : 'POSITIVE',
        headlines: [
          { title: `Demo financial commentary regarding ${sym} quarterly trajectory`, sentiment: 'POSITIVE', score: 0.70, source: 'Demo Wire' },
        ],
        dataSource: 'DEMO',
        analysisDate: daysAgo(1),
      });
    });

    const insertedSentiments = await SentimentAnalysis.insertMany(sentimentAnalysesData);
    console.log(`✓ ${insertedSentiments.length} sentiment records inserted\n`);

    // 10. Insert Watchlists
    console.log('Inserting watchlists...');
    const watchlistsData = [
      {
        userId: primaryUserId,
        name: 'My Technology Stocks',
        symbols: ['TCS', 'INFY', 'AAPL', 'MSFT', 'NVDA'],
        isDefault: true,
      },
      {
        userId: primaryUserId,
        name: 'Indian Blue Chips',
        symbols: ['RELIANCE', 'TCS', 'HDFCBANK', 'LT', 'SBIN'],
        isDefault: false,
      },
      {
        userId: secondUserId,
        name: 'High Beta Growth',
        symbols: ['NVDA', 'TSLA', 'AAPL'],
        isDefault: true,
      },
    ];

    const insertedWatchlists = await Watchlist.insertMany(watchlistsData);
    console.log(`✓ ${insertedWatchlists.length} watchlists inserted\n`);

    // 11. Insert Portfolios
    console.log('Inserting portfolios...');
    const portfoliosData = [
      {
        userId: primaryUserId,
        name: 'Long Term Alpha Portfolio',
        description: 'Balanced Indian and US technology and mega-cap assets',
        totalInvested: 428219.20,
        currentValue: 482450.00,
        profitLoss: 54230.80,
        returnPercentage: 12.66,
        riskScore: 54,
        diversificationScore: 78,
        portfolioBeta: 0.92,
        sharpeRatio: 1.82,
      },
      {
        userId: secondUserId,
        name: 'Tech Momentum Portfolio',
        description: 'US semiconductor and artificial intelligence growth holdings',
        totalInvested: 250000.00,
        currentValue: 289000.00,
        profitLoss: 39000.00,
        returnPercentage: 15.60,
        riskScore: 68,
        diversificationScore: 65,
        portfolioBeta: 1.42,
        sharpeRatio: 1.95,
      },
    ];

    const insertedPortfolios = await Portfolio.insertMany(portfoliosData);
    console.log(`✓ ${insertedPortfolios.length} portfolios inserted\n`);

    const primaryPortfolioId = insertedPortfolios[0]._id;

    // 12. Insert Portfolio Holdings
    console.log('Inserting portfolio holdings...');
    const portfolioHoldingsData = [
      {
        portfolioId: primaryPortfolioId,
        symbol: 'TCS',
        quantity: 42,
        averagePurchasePrice: 3361.50,
        purchaseDate: daysAgo(120),
        currentPrice: 3980.10,
        investedAmount: 141183.00,
        currentValue: 167164.20,
        profitLoss: 25981.20,
        returnPercentage: 18.40,
        riskVector: 'Low (38)',
        shapDriver: 'Cross-Currency Margins',
      },
      {
        portfolioId: primaryPortfolioId,
        symbol: 'RELIANCE',
        quantity: 55,
        averagePurchasePrice: 2689.80,
        purchaseDate: daysAgo(90),
        currentPrice: 2910.45,
        investedAmount: 147939.00,
        currentValue: 160074.75,
        profitLoss: 12135.75,
        returnPercentage: 8.20,
        riskVector: 'Med (52)',
        shapDriver: 'GRM Spread Inflow',
      },
      {
        portfolioId: primaryPortfolioId,
        symbol: 'HDFCBANK',
        quantity: 60,
        averagePurchasePrice: 1475.60,
        purchaseDate: daysAgo(60),
        currentPrice: 1440.30,
        investedAmount: 88536.00,
        currentValue: 86418.00,
        profitLoss: -2118.00,
        returnPercentage: -2.40,
        riskVector: 'Med (62)',
        shapDriver: 'Deposit Cost Pressure',
      },
      {
        portfolioId: primaryPortfolioId,
        symbol: 'INFY',
        quantity: 45,
        averagePurchasePrice: 1261.25,
        purchaseDate: daysAgo(150),
        currentPrice: 1528.70,
        investedAmount: 56756.25,
        currentValue: 68791.50,
        profitLoss: 12035.25,
        returnPercentage: 21.20,
        riskVector: 'Low (41)',
        shapDriver: 'Large Deal TCV Renewal',
      },
    ];

    const insertedHoldings = await PortfolioHolding.insertMany(portfolioHoldingsData);
    console.log(`✓ ${insertedHoldings.length} portfolio holdings inserted\n`);

    // 13. Insert Alerts
    console.log('Inserting alerts...');
    const alertsData = [
      {
        userId: primaryUserId,
        symbol: 'TCS',
        type: 'TREND_CHANGE',
        condition: 'BULLISH',
        threshold: null,
        active: true,
        message: 'Notify when TCS changes to bullish.',
      },
      {
        userId: primaryUserId,
        symbol: 'TCS',
        type: 'PRICE',
        condition: 'GREATER_THAN',
        threshold: 4000.0,
        active: true,
        message: 'Alert when TCS crosses above resistance of ₹4,000.',
      },
      {
        userId: primaryUserId,
        symbol: 'NVDA',
        type: 'VOLATILITY',
        condition: 'GREATER_THAN',
        threshold: 35.0,
        active: true,
        message: 'Notify if NVDA annualized volatility exceeds 35%.',
      },
      {
        userId: primaryUserId,
        symbol: 'TSLA',
        type: 'RISK',
        condition: 'GREATER_THAN',
        threshold: 70.0,
        active: true,
        message: 'Alert if TSLA risk score breaches 70 (High Risk).',
      },
      {
        userId: primaryUserId,
        symbol: 'AAPL',
        type: 'RSI',
        condition: 'GREATER_THAN',
        threshold: 70.0,
        active: false,
        triggeredAt: daysAgo(2),
        message: 'Notify if AAPL RSI crosses overbought threshold of 70.',
      },
      {
        userId: secondUserId,
        symbol: 'NVDA',
        type: 'PREDICTION',
        condition: 'BULLISH',
        threshold: 80.0,
        active: true,
        message: 'Notify if NVDA ML model confidence surpasses 80%.',
      },
    ];

    const insertedAlerts = await Alert.insertMany(alertsData);
    console.log(`✓ ${insertedAlerts.length} alerts inserted\n`);

    // 14. Insert Prediction History
    console.log('Inserting prediction history...');
    const predictionHistoryData = [
      {
        symbol: 'TCS',
        predictionDate: daysAgo(25),
        prediction: 'BULLISH',
        confidence: 74,
        actualOutcome: 'BULLISH',
        wasCorrect: true,
        model: 'XGBoost',
        horizon: '5D',
        priceAtPrediction: 3820.0,
        priceAtResolution: 3895.0,
        returnDeltaPercent: 1.96,
      },
      {
        symbol: 'TCS',
        predictionDate: daysAgo(18),
        prediction: 'BULLISH',
        confidence: 76,
        actualOutcome: 'BULLISH',
        wasCorrect: true,
        model: 'XGBoost',
        horizon: '5D',
        priceAtPrediction: 3880.0,
        priceAtResolution: 3940.0,
        returnDeltaPercent: 1.55,
      },
      {
        symbol: 'TCS',
        predictionDate: daysAgo(10),
        prediction: 'NEUTRAL',
        confidence: 62,
        actualOutcome: 'NEUTRAL',
        wasCorrect: true,
        model: 'XGBoost',
        horizon: '5D',
        priceAtPrediction: 3935.0,
        priceAtResolution: 3925.0,
        returnDeltaPercent: -0.25,
      },
      {
        symbol: 'RELIANCE',
        predictionDate: daysAgo(20),
        prediction: 'BULLISH',
        confidence: 80,
        actualOutcome: 'BULLISH',
        wasCorrect: true,
        model: 'XGBoost',
        horizon: '5D',
        priceAtPrediction: 2840.0,
        priceAtResolution: 2895.0,
        returnDeltaPercent: 1.94,
      },
      {
        symbol: 'AAPL',
        predictionDate: daysAgo(22),
        prediction: 'BULLISH',
        confidence: 82,
        actualOutcome: 'BULLISH',
        wasCorrect: true,
        model: 'XGBoost',
        horizon: '5D',
        priceAtPrediction: 182.5,
        priceAtResolution: 187.2,
        returnDeltaPercent: 2.57,
      },
      {
        symbol: 'TSLA',
        predictionDate: daysAgo(15),
        prediction: 'BEARISH',
        confidence: 68,
        actualOutcome: 'BEARISH',
        wasCorrect: true,
        model: 'XGBoost',
        horizon: '5D',
        priceAtPrediction: 186.0,
        priceAtResolution: 179.4,
        returnDeltaPercent: -3.55,
      },
    ];

    const insertedHistory = await PredictionHistory.insertMany(predictionHistoryData);
    console.log(`✓ ${insertedHistory.length} prediction history records inserted\n`);

    // 15. Insert Model Performance
    console.log('Inserting model performance...');
    const modelPerformanceData = [
      {
        model: 'XGBoost',
        version: '2.4.0',
        accuracy: 0.742,
        precision: 0.760,
        recall: 0.745,
        f1Score: 0.752,
        rocAuc: 0.820,
        logLoss: 0.384,
        confusionMatrix: {
          truePositive: 842,
          trueNegative: 1422,
          falsePositive: 114,
          falseNegative: 72,
        },
        trainingDate: daysAgo(10),
        datasetSize: 15000,
        features: [
          'RSI',
          'MACD',
          'SMA20',
          'SMA50',
          'EMA20',
          'ATR',
          'Volume',
          'Volatility',
          'FinBERT_Sentiment',
          'Benchmark_Beta',
        ],
        status: 'ACTIVE',
        dataSource: 'DEMO',
      },
      {
        model: 'Bi-LSTM Time-Series Network',
        version: '1.4.0',
        accuracy: 0.731,
        precision: 0.740,
        recall: 0.735,
        f1Score: 0.737,
        rocAuc: 0.805,
        logLoss: 0.412,
        confusionMatrix: {
          truePositive: 810,
          trueNegative: 1390,
          falsePositive: 135,
          falseNegative: 85,
        },
        trainingDate: daysAgo(12),
        datasetSize: 15000,
        features: [
          'Sequenced_OHLCV',
          'RSI_Sequence',
          'MACD_Sequence',
          'Normalized_Log_Returns',
        ],
        status: 'BENCHMARK',
        dataSource: 'DEMO',
      },
      {
        model: 'Random Forest Ensemble',
        version: '1.2.0',
        accuracy: 0.718,
        precision: 0.720,
        recall: 0.715,
        f1Score: 0.717,
        rocAuc: 0.785,
        logLoss: 0.448,
        confusionMatrix: {
          truePositive: 780,
          trueNegative: 1360,
          falsePositive: 160,
          falseNegative: 110,
        },
        trainingDate: daysAgo(15),
        datasetSize: 15000,
        features: [
          'SMA_Ratios',
          'Bollinger_Bands',
          'Volume_Surges',
          'Drawdown_Duration',
        ],
        status: 'BENCHMARK',
        dataSource: 'DEMO',
      },
    ];

    const insertedPerformance = await ModelPerformance.insertMany(modelPerformanceData);
    console.log(`✓ ${insertedPerformance.length} model performance records inserted\n`);

    // 16. Insert Market Regimes
    console.log('Inserting market regimes...');
    const marketRegimesData = [
      {
        market: 'India',
        index: 'NIFTY50',
        regime: 'BULL_MARKET',
        volatilityLevel: 'MEDIUM',
        trendStrength: 72,
        confidence: 81,
        divergenceAnomaly: 'Zero Critical Found',
        dataSource: 'DEMO',
        analysisDate: daysAgo(1),
      },
      {
        market: 'United States',
        index: 'NASDAQ100',
        regime: 'HIGH_VOLATILITY',
        volatilityLevel: 'HIGH',
        trendStrength: 65,
        confidence: 76,
        divergenceAnomaly: 'Tech Dispersion Watch',
        dataSource: 'DEMO',
        analysisDate: daysAgo(1),
      },
      {
        market: 'United States',
        index: 'S&P500',
        regime: 'BULL_MARKET',
        volatilityLevel: 'MEDIUM',
        trendStrength: 70,
        confidence: 79,
        divergenceAnomaly: 'Zero Critical Found',
        dataSource: 'DEMO',
        analysisDate: daysAgo(1),
      },
    ];

    const insertedRegimes = await MarketRegime.insertMany(marketRegimesData);
    console.log(`✓ ${insertedRegimes.length} market regimes inserted\n`);

    // 17. Insert Reports
    console.log('Inserting reports...');
    const reportsData = [
      {
        userId: primaryUserId,
        symbol: 'TCS',
        reportType: 'AUDIT_DOSSIER',
        title: 'TCS Quantitative AI Audit Dossier v2.4',
        summary: 'Institutional TreeSHAP attribution and 1-Day 95% VaR compliance certification for Tata Consultancy Services.',
        predictionId: insertedPredictions[0]._id,
        riskAssessmentId: insertedRisks[0]._id,
        aiAnalysisId: insertedAIAnalyses[0]._id,
        fileFormat: 'PDF',
      },
      {
        userId: primaryUserId,
        symbol: 'AAPL',
        reportType: 'AUDIT_DOSSIER',
        title: 'Apple Inc. Multi-Horizon Forecast Assessment',
        summary: 'Services revenue resilience and buyback execution dampening downside tail-risk.',
        predictionId: insertedPredictions[4]._id,
        riskAssessmentId: insertedRisks[4]._id,
        aiAnalysisId: insertedAIAnalyses[1]._id,
        fileFormat: 'PDF',
      },
      {
        userId: primaryUserId,
        symbol: 'NVDA',
        reportType: 'RISK_SUMMARY',
        title: 'NVIDIA High-Beta Risk Exposure Matrix',
        summary: 'High beta sensitivity analysis and Monte Carlo geometric Brownian motion path distributions.',
        fileFormat: 'JSON',
      },
      {
        userId: secondUserId,
        symbol: 'TSLA',
        reportType: 'PREDICTION_AUDIT',
        title: 'Tesla Margin Compression & Short Risk Note',
        summary: 'Auto gross margin compression attribution analysis in gradient boosted decision trees.',
        fileFormat: 'MARKDOWN',
      },
    ];

    const insertedReports = await Report.insertMany(reportsData);
    console.log(`✓ ${insertedReports.length} reports inserted\n`);

    // Create Indexes across all collections
    console.log('Creating database indexes...');
    await Promise.all([
      User.createIndexes(),
      Stock.createIndexes(),
      HistoricalPrice.createIndexes(),
      TechnicalIndicator.createIndexes(),
      Prediction.createIndexes(),
      RiskAssessment.createIndexes(),
      AIAnalysis.createIndexes(),
      SentimentAnalysis.createIndexes(),
      Watchlist.createIndexes(),
      Portfolio.createIndexes(),
      PortfolioHolding.createIndexes(),
      Alert.createIndexes(),
      PredictionHistory.createIndexes(),
      ModelPerformance.createIndexes(),
      MarketRegime.createIndexes(),
      Report.createIndexes(),
    ]);
    console.log('✓ All collection indexes synchronized successfully.\n');

    console.log('==================================================');
    console.log('DATABASE SEED COMPLETED SUCCESSFULLY');
    console.log('==================================================\n');
    console.log('Database:\nstockSenseAI\n');
    console.log('Collections:');
    console.log('users');
    console.log('stocks');
    console.log('historicalPrices');
    console.log('technicalIndicators');
    console.log('predictions');
    console.log('riskAssessments');
    console.log('aiAnalyses');
    console.log('sentimentAnalyses');
    console.log('watchlists');
    console.log('portfolios');
    console.log('portfolioHoldings');
    console.log('alerts');
    console.log('predictionHistory');
    console.log('modelPerformance');
    console.log('marketRegimes');
    console.log('reports');
    console.log('\n==================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed execution error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedDatabase();
