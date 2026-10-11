import { StockData, PortfolioHolding, WatchlistItem } from '../types/stock';

export const ALL_STOCKS: Record<string, StockData> = {
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    currency: '₹',
    price: 3924.50,
    priceFormatted: '₹3,924.50',
    change: 48.20,
    changePercent: 1.24,
    volume: '2.41M',
    marketOpen: true,
    trendScore: 81,
    finbertSentiment: 0.74,
    riskScore: 62,
    riskCategory: 'MODERATE',
    sharpeRatio: 1.74,
    sortinoRatio: 2.12,
    confidence: 78,
    forecastDirection: 'BULLISH',
    expectedDelta: '+1.6% to +3.4%',
    targetRange: '₹3,990 – ₹4,060',
    probabilities: {
      bullish: 78,
      neutral: 14,
      bearish: 8
    },
    invalidationLevel: '₹3,840.00',
    resistanceLevel: '₹3,980',
    volatilityAnn: 18.4,
    maxDrawdown: -14.2,
    var95: -2.10,
    varAmount: '₹82.41 / share',
    beta: 0.88,
    downsideDev: 9.8,
    atr14: 42.80,
    atrAmount: '₹42.80',
    factors: {
      volatility: { score: 3, label: 'Medium (3/5)' },
      drawdown: { score: 3, label: 'Moderate (3/5)' },
      tailRisk: { score: 2, label: 'Low-Medium (2/5)' },
      marketBeta: { score: 2, label: 'Defensive (2/5)' },
      liquidity: { score: 1, label: 'Negligible (1/5)' }
    },
    rsi: 64.2,
    macd: '+12.4 Cross',
    bollingerStatus: 'Expand Upper',
    confirmationChecklist: [
      { id: '1', name: 'SMA 20 > SMA 50', status: 'Golden Cross', isBullish: true, type: 'positive' },
      { id: '2', name: 'RSI Momentum', status: '64.2 Bullish Zone', isBullish: true, type: 'positive' },
      { id: '3', name: 'MACD Histogram', status: '+18.4 Expansion', isBullish: true, type: 'positive' },
      { id: '4', name: 'Volume Confirmation', status: '1.25x 20-Day Avg', isBullish: true, type: 'positive' },
      { id: '5', name: 'Price Action Sequence', status: 'Higher-High Formed', isBullish: true, type: 'positive' },
      { id: '6', name: 'NIFTY 50 Macro Context', status: 'Correlated (+0.82)', isBullish: true, type: 'positive' },
      { id: '7', name: 'ATR Volatility Regime', status: 'Elevated / Neutral', isBullish: false, type: 'warning' },
    ],
    baselineLogOdds: 0.42,
    finalLogOdds: 1.28,
    netShap: '+0.86 net',
    shapFactors: [
      {
        name: 'RSI (14-period)',
        badge: '64.2',
        value: 0.28,
        rawFormatted: '+0.28',
        description: 'Strong upward momentum, non-saturated overbought threshold',
        isDrag: false
      },
      {
        name: 'MACD Histogram Cross',
        badge: '+12.4',
        value: 0.22,
        rawFormatted: '+0.22',
        description: 'Bullish zero-line separation confirmed on daily interval',
        isDrag: false
      },
      {
        name: 'Price vs. 50-day SMA',
        badge: '+3.8%',
        value: 0.19,
        rawFormatted: '+0.19',
        description: 'Ascending structural continuation past primary institutional anchor',
        isDrag: false
      },
      {
        name: '5D Relative Volume',
        badge: '1.34x',
        value: 0.15,
        rawFormatted: '+0.15',
        description: 'Accumulation pattern detected via block delivery volume',
        isDrag: false
      },
      {
        name: 'FinBERT News Sentiment',
        badge: '+0.68',
        value: 0.11,
        rawFormatted: '+0.11',
        description: 'Positive consensus across IT earnings transcripts & filings',
        isDrag: false
      },
      {
        name: 'ATR Volatility Influx',
        badge: 'High',
        value: -0.12,
        rawFormatted: '-0.12',
        description: 'Expanded intraday range dampens deterministic follow-through',
        isDrag: true
      },
      {
        name: 'Drawdown Supply Wall',
        badge: '₹4,020',
        value: -0.08,
        rawFormatted: '-0.08',
        description: 'Historical profit-taking liquidity cluster resting near ₹4,020 ceiling',
        isDrag: true
      }
    ],
    scenarios: [
      {
        title: 'Bull Continuation Scenario',
        type: 'bull',
        probability: 55,
        description: 'Clean breakout above ₹3,980 pivots onward to target ₹4,060 supported by delivery volume confirmation.',
        targetOrBand: 'Target: ₹4,060.00',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 2.8'
      },
      {
        title: 'Base Consolidation Zone',
        type: 'base',
        probability: 35,
        description: 'Subdued sector dispersion results in range-bound trading oscillating closely between ₹3,910 and ₹3,960.',
        targetOrBand: 'Band: ₹3,910 – ₹3,960',
        riskRewardOrStrategy: 'Strategy: Theta Capture'
      },
      {
        title: 'Bearish Retest Warning',
        type: 'bear',
        probability: 10,
        description: 'Macro tech weakness invalidates near-term support, prompting re-examination of the 50-day SMA floor at ₹3,840.',
        targetOrBand: 'Invalidation Level: ₹3,840.00',
        riskRewardOrStrategy: 'Buffer: -3.5%'
      }
    ],
    technicalNarrative: 'XGBoost ensemble leaf transitions converged primarily on positive moving average momentum divergence (dSMA50 +3.8%) and persistent buy-side volume acceleration (1.34x vol spike).',
    eli5Narrative: 'The AI is confident TCS will climb because it is trading comfortably above its 50-day average trendline, institutional buyer demand has surged significantly over the last 5 sessions, and positive IT sector earnings sentiment is creating a powerful tailwind.',
    vivaVaRLogic: 'Calculated via non-parametric empirical distribution over trailing 252 log returns. In 95% of trading days, single-session adverse price deviation will not exceed 2.10%. Serves as our primary boundary constraint for capital-at-risk limits.',
    vivaBetaLogic: 'Beta of 0.88 establishes that TCS moves ~12% less violently than NIFTY index fluctuations. Combined with an ATR of ₹42.80 (1.09% daily swing band), position sizing models can calibrate stop losses at 1.5× ATR (₹64.20) without getting stopped out by standard market noise.'
  },

  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NSDQ',
    currency: '$',
    price: 189.45,
    priceFormatted: '$189.45',
    change: 2.32,
    changePercent: 1.24,
    volume: '54.2M',
    marketOpen: true,
    trendScore: 84,
    finbertSentiment: 0.82,
    riskScore: 48,
    riskCategory: 'LOW',
    sharpeRatio: 2.05,
    sortinoRatio: 2.45,
    confidence: 81,
    forecastDirection: 'BULLISH',
    expectedDelta: '+2.1% to +4.5%',
    targetRange: '$193.00 – $198.50',
    probabilities: {
      bullish: 81,
      neutral: 12,
      bearish: 7
    },
    invalidationLevel: '$183.50',
    resistanceLevel: '$191.00',
    volatilityAnn: 16.2,
    maxDrawdown: -11.8,
    var95: -1.75,
    varAmount: '$3.32 / share',
    beta: 0.94,
    downsideDev: 8.4,
    atr14: 2.85,
    atrAmount: '$2.85',
    factors: {
      volatility: { score: 2, label: 'Low-Medium (2/5)' },
      drawdown: { score: 2, label: 'Controlled (2/5)' },
      tailRisk: { score: 2, label: 'Low (2/5)' },
      marketBeta: { score: 2, label: 'Defensive (2/5)' },
      liquidity: { score: 1, label: 'Top Tier (1/5)' }
    },
    rsi: 66.8,
    macd: '+2.41 Cross',
    bollingerStatus: 'Expanding North',
    confirmationChecklist: [
      { id: '1', name: 'SMA 20 > SMA 50', status: 'Strong Uptrend', isBullish: true, type: 'positive' },
      { id: '2', name: 'RSI Momentum', status: '66.8 Bullish Zone', isBullish: true, type: 'positive' },
      { id: '3', name: 'Services Revenue Run-rate', status: '+14% YoY Expansion', isBullish: true, type: 'positive' },
      { id: '4', name: 'Institutional Block Buying', status: '3 Consecutive Sessions', isBullish: true, type: 'positive' },
      { id: '5', name: 'Macro NASDAQ Correlation', status: 'Lead Engine (+0.91)', isBullish: true, type: 'positive' },
      { id: '6', name: 'Option Call Skew', status: 'Strong Call Delta Imbalance', isBullish: true, type: 'positive' },
    ],
    baselineLogOdds: 0.51,
    finalLogOdds: 1.45,
    netShap: '+0.94 net',
    shapFactors: [
      {
        name: 'Services Margin Resilience',
        badge: '74.2%',
        value: 0.31,
        rawFormatted: '+0.31',
        description: 'Recurring software and iCloud subscriptions driving cash flow certainty',
        isDrag: false
      },
      {
        name: 'RSI (14-period) Trend',
        badge: '66.8',
        value: 0.25,
        rawFormatted: '+0.25',
        description: 'Healthy accumulation channel above key moving averages',
        isDrag: false
      },
      {
        name: 'Buyback Execution Flow',
        badge: '$110B Cap',
        value: 0.20,
        rawFormatted: '+0.20',
        description: 'Persistent corporate treasury floor buffering intraday pullbacks',
        isDrag: false
      },
      {
        name: 'China Smartphone Supply Check',
        badge: 'Restricted',
        value: -0.11,
        rawFormatted: '-0.11',
        description: 'Slight headwind from local competition in mainland electronics',
        isDrag: true
      }
    ],
    scenarios: [
      {
        title: 'Breakout to All-Time High',
        type: 'bull',
        probability: 60,
        description: 'Follow-through past $191.00 resistance targets $198.50 with robust institutional volume.',
        targetOrBand: 'Target: $198.50',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 3.2'
      },
      {
        title: 'Consolidation at High Base',
        type: 'base',
        probability: 30,
        description: 'Trading in tight range $187 - $191 awaiting macroeconomic catalysts.',
        targetOrBand: 'Band: $187.00 – $191.00',
        riskRewardOrStrategy: 'Strategy: Accumulation'
      },
      {
        title: 'Systemic Tech Retracement',
        type: 'bear',
        probability: 10,
        description: 'Broad market treasury yield spikes test initial support at $183.50.',
        targetOrBand: 'Invalidation Level: $183.50',
        riskRewardOrStrategy: 'Buffer: -3.1%'
      }
    ],
    technicalNarrative: 'TreeSHAP assigns dominant credit to cash-flow multiples and low systematic beta, keeping downside tail risks heavily bounded.',
    eli5Narrative: 'Apple is experiencing strong support from massive stock buybacks and reliable service revenues, leading our AI models to predict steady upward momentum.',
    vivaVaRLogic: '1-Day VaR at 95% indicates maximum expected single-day loss of $3.32 (1.75%), placing Apple in the top decile of low-volatility mega-caps.',
    vivaBetaLogic: 'Beta of 0.94 reflects solid institutional sponsorship, shielding against extreme swings seen in speculative growth tech.'
  },

  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    exchange: 'NSE',
    currency: '₹',
    price: 2910.45,
    priceFormatted: '₹2,910.45',
    change: 22.10,
    changePercent: 0.77,
    volume: '4.85M',
    marketOpen: true,
    trendScore: 82,
    finbertSentiment: 0.71,
    riskScore: 52,
    riskCategory: 'MODERATE',
    sharpeRatio: 1.86,
    sortinoRatio: 2.20,
    confidence: 82,
    forecastDirection: 'BULLISH',
    expectedDelta: '+1.8% to +3.9%',
    targetRange: '₹2,960 – ₹3,025',
    probabilities: {
      bullish: 82,
      neutral: 11,
      bearish: 7
    },
    invalidationLevel: '₹2,840.00',
    resistanceLevel: '₹2,950',
    volatilityAnn: 17.1,
    maxDrawdown: -12.4,
    var95: -1.90,
    varAmount: '₹55.30 / share',
    beta: 0.96,
    downsideDev: 8.9,
    atr14: 36.50,
    atrAmount: '₹36.50',
    factors: {
      volatility: { score: 2, label: 'Low-Medium (2/5)' },
      drawdown: { score: 2, label: 'Moderate (2/5)' },
      tailRisk: { score: 2, label: 'Low-Medium (2/5)' },
      marketBeta: { score: 3, label: 'Benchmark (3/5)' },
      liquidity: { score: 1, label: 'Exceptional (1/5)' }
    },
    rsi: 61.5,
    macd: '+8.90 Cross',
    bollingerStatus: 'Upper Band Ride',
    confirmationChecklist: [
      { id: '1', name: 'GRM Refining Spread Expansion', status: 'Crude Margins Firm', isBullish: true, type: 'positive' },
      { id: '2', name: 'Jio ARPU Trajectory', status: 'ARPU Upward Inflection', isBullish: true, type: 'positive' },
      { id: '3', name: 'Retail Footprint Growth', status: '+18% YoY Sales Area', isBullish: true, type: 'positive' },
      { id: '4', name: 'SMA 50 Support Cushion', status: '+4.2% Above 50 SMA', isBullish: true, type: 'positive' },
    ],
    baselineLogOdds: 0.44,
    finalLogOdds: 1.34,
    netShap: '+0.90 net',
    shapFactors: [
      {
        name: 'Refining GRM Margin Tailwinds',
        badge: '$11.8/bbl',
        value: 0.32,
        rawFormatted: '+0.32',
        description: 'Global diesel and jet fuel crack spread expansion',
        isDrag: false
      },
      {
        name: 'Digital Telecom ARPU Boost',
        badge: '₹182 Avg',
        value: 0.24,
        rawFormatted: '+0.24',
        description: 'Tariff stabilization accelerating free cash generation in 5G services',
        isDrag: false
      },
      {
        name: 'Crude Price Volatility',
        badge: 'Brent $85',
        value: -0.10,
        rawFormatted: '-0.10',
        description: 'Upstream exploration uncertainty dampens pure momentum plays',
        isDrag: true
      }
    ],
    scenarios: [
      {
        title: '3,000 Milestone Breakout',
        type: 'bull',
        probability: 58,
        description: 'Breakout above ₹2,950 psychological hurdle triggers programmatic buy orders to ₹3,025.',
        targetOrBand: 'Target: ₹3,025.00',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 2.9'
      },
      {
        title: 'Congestion at 2,900 Handle',
        type: 'base',
        probability: 32,
        description: 'Balanced buyer-seller absorption between ₹2,880 and ₹2,930.',
        targetOrBand: 'Band: ₹2,880 – ₹2,930',
        riskRewardOrStrategy: 'Strategy: Swing Pivot'
      },
      {
        title: 'Energy Sector Pullback',
        type: 'bear',
        probability: 10,
        description: 'Commodity downcycle tests demand support floor near ₹2,840.',
        targetOrBand: 'Invalidation Level: ₹2,840.00',
        riskRewardOrStrategy: 'Buffer: -2.4%'
      }
    ],
    technicalNarrative: 'High conglomerate diversification insulates earnings volatility, creating an institutional buy-on-dips structural bias.',
    eli5Narrative: 'Reliance benefits from solid oil refining margins and growing 5G telecom subscriptions, giving it strong momentum with low volatility.',
    vivaVaRLogic: 'Historical 1-day Value at Risk sits at 1.90%, showing strong stability given its significant 10%+ index weighting in NIFTY 50.',
    vivaBetaLogic: 'Beta of 0.96 closely mirrors the benchmark index while delivering alpha through retail and telecom subsidaries.'
  },

  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NSDQ',
    currency: '$',
    price: 894.20,
    priceFormatted: '$894.20',
    change: 27.10,
    changePercent: 3.12,
    volume: '68.4M',
    marketOpen: true,
    trendScore: 89,
    finbertSentiment: 0.91,
    riskScore: 58,
    riskCategory: 'MODERATE',
    sharpeRatio: 2.34,
    sortinoRatio: 2.88,
    confidence: 89,
    forecastDirection: 'BULLISH',
    expectedDelta: '+3.5% to +6.8%',
    targetRange: '$925.00 – $955.00',
    probabilities: {
      bullish: 89,
      neutral: 7,
      bearish: 4
    },
    invalidationLevel: '$840.00',
    resistanceLevel: '$910.00',
    volatilityAnn: 34.2,
    maxDrawdown: -18.6,
    var95: -3.40,
    varAmount: '$30.40 / share',
    beta: 1.62,
    downsideDev: 14.2,
    atr14: 28.50,
    atrAmount: '$28.50',
    factors: {
      volatility: { score: 4, label: 'Elevated (4/5)' },
      drawdown: { score: 3, label: 'Moderate (3/5)' },
      tailRisk: { score: 3, label: 'Moderate (3/5)' },
      marketBeta: { score: 5, label: 'High Beta (5/5)' },
      liquidity: { score: 1, label: 'Maximum (1/5)' }
    },
    rsi: 71.4,
    macd: '+18.50 Cross',
    bollingerStatus: 'Strong Upper Band Surge',
    confirmationChecklist: [
      { id: '1', name: 'Blackwell GPU Demand Surge', status: 'Booked 5 Quarters Out', isBullish: true, type: 'positive' },
      { id: '2', name: 'Hyperscaler CapEx Acceleration', status: 'Cloud CapEx +42% YoY', isBullish: true, type: 'positive' },
      { id: '3', name: 'RSI Momentum Confirmation', status: '71.4 Strong Expansion', isBullish: true, type: 'positive' },
      { id: '4', name: 'Institutional Order Flow', status: 'Dark Pool Buying +2.2x', isBullish: true, type: 'positive' },
    ],
    baselineLogOdds: 0.62,
    finalLogOdds: 1.84,
    netShap: '+1.22 net',
    shapFactors: [
      {
        name: 'Data Center AI Revenue Growth',
        badge: '+260% YoY',
        value: 0.48,
        rawFormatted: '+0.48',
        description: 'Unprecedented enterprise accelerator hardware deliveries',
        isDrag: false
      },
      {
        name: 'Gross Margin Expansion',
        badge: '76.8%',
        value: 0.35,
        rawFormatted: '+0.35',
        description: 'Pricing power over proprietary CUDA software moat',
        isDrag: false
      },
      {
        name: 'Semiconductor Foundry Supply Bottleneck',
        badge: 'TSMC CoWoS',
        value: -0.16,
        rawFormatted: '-0.16',
        description: 'Packaging capacity limits cap maximum upside shipment speed',
        isDrag: true
      }
    ],
    scenarios: [
      {
        title: 'AI Supercycle Ramp to $955',
        type: 'bull',
        probability: 68,
        description: 'Continuation through $910 initiates short squeeze towards $955 level.',
        targetOrBand: 'Target: $955.00',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 3.8'
      },
      {
        title: 'Sideways Volatility Digestion',
        type: 'base',
        probability: 24,
        description: 'Consolidation between $870 and $910 to digest recent multi-session gains.',
        targetOrBand: 'Band: $870.00 – $910.00',
        riskRewardOrStrategy: 'Strategy: Momentum Hold'
      },
      {
        title: 'Macro High-Beta Shakeout',
        type: 'bear',
        probability: 8,
        description: 'Systemic interest rate fear triggers rapid -5% retest to $840 floor.',
        targetOrBand: 'Invalidation Level: $840.00',
        riskRewardOrStrategy: 'Buffer: -6.0%'
      }
    ],
    technicalNarrative: 'Exceptional earnings revisions overpower standard valuation metrics, with TreeSHAP weighting data center compute demand as top contributor.',
    eli5Narrative: 'NVIDIA leads the worldwide AI boom with unmatched chip demand and high profit margins, making it a powerful trend runner despite high daily swings.',
    vivaVaRLogic: 'Daily Value at Risk is higher (-3.40%) reflecting high-beta technology profile; position sizing must scale down proportionally.',
    vivaBetaLogic: 'Beta of 1.62 indicates NVIDIA moves 62% more sharply than the S&P 500, offering immense upside during bullish tech runs.'
  },

  INFY: {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    exchange: 'NSE',
    currency: '₹',
    price: 1528.70,
    priceFormatted: '₹1,528.70',
    change: 16.50,
    changePercent: 1.10,
    volume: '3.12M',
    marketOpen: true,
    trendScore: 74,
    finbertSentiment: 0.65,
    riskScore: 41,
    riskCategory: 'LOW',
    sharpeRatio: 1.68,
    sortinoRatio: 2.04,
    confidence: 74,
    forecastDirection: 'BULLISH',
    expectedDelta: '+1.4% to +3.0%',
    targetRange: '₹1,560 – ₹1,610',
    probabilities: {
      bullish: 74,
      neutral: 18,
      bearish: 8
    },
    invalidationLevel: '₹1,475.00',
    resistanceLevel: '₹1,550',
    volatilityAnn: 17.8,
    maxDrawdown: -13.5,
    var95: -1.95,
    varAmount: '₹29.80 / share',
    beta: 0.91,
    downsideDev: 8.7,
    atr14: 21.40,
    atrAmount: '₹21.40',
    factors: {
      volatility: { score: 2, label: 'Low-Medium (2/5)' },
      drawdown: { score: 2, label: 'Moderate (2/5)' },
      tailRisk: { score: 2, label: 'Low (2/5)' },
      marketBeta: { score: 2, label: 'Defensive (2/5)' },
      liquidity: { score: 1, label: 'Negligible (1/5)' }
    },
    rsi: 59.4,
    macd: '+5.20 Cross',
    bollingerStatus: 'Consolidating Mid-Upper',
    confirmationChecklist: [
      { id: '1', name: 'Large Deal TCV Renewal', status: '$3.2B Quarterly Win', isBullish: true, type: 'positive' },
      { id: '2', name: 'Digital Core Transformation', status: 'Cloud & AI Migration Flow', isBullish: true, type: 'positive' },
      { id: '3', name: 'Attrition Rate Stabilization', status: 'Down to 12.6%', isBullish: true, type: 'positive' },
      { id: '4', name: 'NIFTY IT Index Co-movement', status: '+0.88 Correlation', isBullish: true, type: 'positive' },
    ],
    baselineLogOdds: 0.38,
    finalLogOdds: 1.15,
    netShap: '+0.77 net',
    shapFactors: [
      {
        name: 'Large Deal TCV Renewal',
        badge: '$3.2B TCV',
        value: 0.29,
        rawFormatted: '+0.29',
        description: 'Multi-year enterprise contracts ensure revenue floor',
        isDrag: false
      },
      {
        name: 'Operating Margin Expansion',
        badge: '21.4%',
        value: 0.21,
        rawFormatted: '+0.21',
        description: 'Cost optimization and automated delivery platforms',
        isDrag: false
      },
      {
        name: 'Discretionary IT Spending Slowness',
        badge: 'BFSI Sector',
        value: -0.12,
        rawFormatted: '-0.12',
        description: 'US and European client hesitation on uncommitted projects',
        isDrag: true
      }
    ],
    scenarios: [
      {
        title: 'Breakout to ₹1,610 Range',
        type: 'bull',
        probability: 52,
        description: 'Confirmation above ₹1,550 resistance sets path towards ₹1,610 quarterly high.',
        targetOrBand: 'Target: ₹1,610.00',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 2.5'
      },
      {
        title: 'Narrow Band Sideways Action',
        type: 'base',
        probability: 38,
        description: 'Oscillating closely between ₹1,510 and ₹1,545 amid sector consolidation.',
        targetOrBand: 'Band: ₹1,510 – ₹1,545',
        riskRewardOrStrategy: 'Strategy: Mean Reversion'
      },
      {
        title: 'Support Retest at ₹1,475',
        type: 'bear',
        probability: 10,
        description: 'Earnings preview selloff touches 50-day moving average at ₹1,475.',
        targetOrBand: 'Invalidation Level: ₹1,475.00',
        riskRewardOrStrategy: 'Buffer: -3.5%'
      }
    ],
    technicalNarrative: 'Healthy contract pipeline and disciplined margin execution provide stable TreeSHAP baseline probabilities.',
    eli5Narrative: 'Infosys is steadily winning long-term tech contracts with low employee turnover, giving it solid and predictable growth prospects.',
    vivaVaRLogic: '1-Day VaR at 95% indicates adverse price swing limited to ₹29.80, keeping capital risk very safe.',
    vivaBetaLogic: 'Beta of 0.91 protects portfolios from market swings while capturing enterprise software recovery upside.'
  },

  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    exchange: 'NSDQ',
    currency: '$',
    price: 178.60,
    priceFormatted: '$178.60',
    change: 5.45,
    changePercent: 3.15,
    volume: '82.1M',
    marketOpen: true,
    trendScore: 54,
    finbertSentiment: 0.42,
    riskScore: 74,
    riskCategory: 'HIGH',
    sharpeRatio: 1.12,
    sortinoRatio: 1.35,
    confidence: 68,
    forecastDirection: 'BEARISH',
    expectedDelta: '-2.4% to +1.2%',
    targetRange: '$168.00 – $184.00',
    probabilities: {
      bullish: 24,
      neutral: 28,
      bearish: 48
    },
    invalidationLevel: '$189.00',
    resistanceLevel: '$182.00',
    volatilityAnn: 44.5,
    maxDrawdown: -28.4,
    var95: -4.20,
    varAmount: '$7.50 / share',
    beta: 2.15,
    downsideDev: 18.2,
    atr14: 9.80,
    atrAmount: '$9.80',
    factors: {
      volatility: { score: 5, label: 'Extreme (5/5)' },
      drawdown: { score: 4, label: 'High (4/5)' },
      tailRisk: { score: 4, label: 'High (4/5)' },
      marketBeta: { score: 5, label: 'Hyper Beta (5/5)' },
      liquidity: { score: 1, label: 'Maximum (1/5)' }
    },
    rsi: 48.2,
    macd: '-1.45 Divergence',
    bollingerStatus: 'Lower Band Squeeze',
    confirmationChecklist: [
      { id: '1', name: 'Auto Gross Margin Squeeze', status: '16.4% Below Historical', isBullish: false, type: 'warning' },
      { id: '2', name: 'EV Price War Discounting', status: 'China Delivery Pressure', isBullish: false, type: 'warning' },
      { id: '3', name: 'Full Self-Driving Monetization', status: 'Robotaxi Event Catalyst', isBullish: true, type: 'positive' },
      { id: '4', name: 'Energy Storage Deployments', status: 'Megapack +125% YoY', isBullish: true, type: 'positive' },
    ],
    baselineLogOdds: 0.28,
    finalLogOdds: -0.15,
    netShap: '-0.43 net',
    shapFactors: [
      {
        name: 'Auto Margin Compression',
        badge: '16.4%',
        value: -0.38,
        rawFormatted: '-0.38',
        description: 'Repeated vehicle price reductions eroding quarterly operating profit',
        isDrag: true
      },
      {
        name: 'China EV Competition Pressure',
        badge: 'BYD Inflow',
        value: -0.22,
        rawFormatted: '-0.22',
        description: 'Market share contest in largest international electric vehicle arena',
        isDrag: true
      },
      {
        name: 'Energy Storage Megapack Growth',
        badge: '4.1 GWh',
        value: 0.17,
        rawFormatted: '+0.17',
        description: 'Utility-scale battery segment expanding rapidly with 25%+ gross margins',
        isDrag: false
      }
    ],
    scenarios: [
      {
        title: 'Breakdown Below Support to $168',
        type: 'bear',
        probability: 48,
        description: 'Failure to hold $175 support triggers breakdown towards $168 quarterly lows.',
        targetOrBand: 'Target: $168.00',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 2.4'
      },
      {
        title: 'Sideways Squeeze Range',
        type: 'base',
        probability: 28,
        description: 'Rangebound chop between $172 and $182 awaiting autonomy day catalyst.',
        targetOrBand: 'Band: $172.00 – $182.00',
        riskRewardOrStrategy: 'Strategy: Volatility Straddle'
      },
      {
        title: 'Short Covering Relief Spike',
        type: 'bull',
        probability: 24,
        description: 'Unexpected delivery volume upside forces bear covering back to $189.',
        targetOrBand: 'Invalidation Level: $189.00',
        riskRewardOrStrategy: 'Buffer: +5.8%'
      }
    ],
    technicalNarrative: 'Negative auto gross margin revisions create persistent drag in gradient boosted trees despite speculative autonomy option value.',
    eli5Narrative: 'Tesla is facing intense electric vehicle price cuts and competition, making our models cautious until profits stabilize.',
    vivaVaRLogic: 'Extreme 1-day VaR of -4.20% requires strict risk controls, as single-session gap risks are highest in this stock.',
    vivaBetaLogic: 'Beta of 2.15 means Tesla reacts twice as strongly as the broader market to macro news and rate changes.'
  },

  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    exchange: 'NSE',
    currency: '₹',
    price: 1440.30,
    priceFormatted: '₹1,440.30',
    change: -3.40,
    changePercent: -0.24,
    volume: '8.40M',
    marketOpen: true,
    trendScore: 61,
    finbertSentiment: 0.52,
    riskScore: 62,
    riskCategory: 'MODERATE',
    sharpeRatio: 1.48,
    sortinoRatio: 1.76,
    confidence: 61,
    forecastDirection: 'NEUTRAL',
    expectedDelta: '-0.8% to +1.5%',
    targetRange: '₹1,420 – ₹1,475',
    probabilities: {
      bullish: 29,
      neutral: 61,
      bearish: 10
    },
    invalidationLevel: '₹1,390.00',
    resistanceLevel: '₹1,475',
    volatilityAnn: 16.5,
    maxDrawdown: -14.8,
    var95: -2.05,
    varAmount: '₹29.50 / share',
    beta: 0.98,
    downsideDev: 8.8,
    atr14: 18.20,
    atrAmount: '₹18.20',
    factors: {
      volatility: { score: 2, label: 'Low-Medium (2/5)' },
      drawdown: { score: 3, label: 'Moderate (3/5)' },
      tailRisk: { score: 2, label: 'Low-Medium (2/5)' },
      marketBeta: { score: 3, label: 'Benchmark (3/5)' },
      liquidity: { score: 1, label: 'Exceptional (1/5)' }
    },
    rsi: 51.2,
    macd: '+0.15 Neutral',
    bollingerStatus: 'Channel Range Contraction',
    confirmationChecklist: [
      { id: '1', name: 'Credit-Deposit (LDR) Normalization', status: 'LDR Easing to 102%', isBullish: true, type: 'positive' },
      { id: '2', name: 'Net Interest Margin (NIM) Stabilization', status: '3.45% Flat QoQ', isBullish: false, type: 'neutral' },
      { id: '3', name: 'Asset Quality GNPA', status: 'GNPA Stable at 1.24%', isBullish: true, type: 'positive' },
      { id: '4', name: 'Institutional FII Absorption', status: 'Neutral Institutional Flow', isBullish: false, type: 'neutral' },
    ],
    baselineLogOdds: 0.32,
    finalLogOdds: 0.44,
    netShap: '+0.12 net',
    shapFactors: [
      {
        name: 'Merger Deposit Mobilization',
        badge: '18% YoY',
        value: 0.18,
        rawFormatted: '+0.18',
        description: 'Progress in absorbing high-cost legacy borrowings with retail deposits',
        isDrag: false
      },
      {
        name: 'Deposit Cost Pressure',
        badge: 'High Cost',
        value: -0.15,
        rawFormatted: '-0.15',
        description: 'Interest rate competition keeping cost of funds elevated across banks',
        isDrag: true
      },
      {
        name: 'Stable Wholesale Credit Quality',
        badge: 'AAA Corporates',
        value: 0.09,
        rawFormatted: '+0.09',
        description: 'Minimal corporate default provisioning required over trailing quarters',
        isDrag: false
      }
    ],
    scenarios: [
      {
        title: 'Range-Bound Consolidation in ₹1,420-₹1,475',
        type: 'base',
        probability: 61,
        description: 'Equilibrium between deposit accretion and margin pressures produces sideways oscillation.',
        targetOrBand: 'Band: ₹1,420 – ₹1,475',
        riskRewardOrStrategy: 'Strategy: Theta Capture'
      },
      {
        title: 'NIM Expansion Breakout to ₹1,510',
        type: 'bull',
        probability: 29,
        description: 'RBI liquidity easing catalyzes re-rating towards pre-merger price levels.',
        targetOrBand: 'Target: ₹1,510.00',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 2.2'
      },
      {
        title: 'LDR Stress Retest to ₹1,390',
        type: 'bear',
        probability: 10,
        description: 'Subdued deposit growth prolongs balance sheet restructuring pressure.',
        targetOrBand: 'Invalidation Level: ₹1,390.00',
        riskRewardOrStrategy: 'Buffer: -3.5%'
      }
    ],
    technicalNarrative: 'Post-merger balance sheet integration is entering maturity phase, dampening large directional swings and keeping probabilities centered in Neutral.',
    eli5Narrative: 'HDFC Bank is steadily integrating its mega-merger; deposit growth is solid, so prices are expected to trade in a safe, steady range for now.',
    vivaVaRLogic: 'VaR 95% is stable at -2.05%, making HDFC Bank a classic low-beta banking anchor.',
    vivaBetaLogic: 'Beta of 0.98 ensures the stock tracks broad Indian economic expansion with minimal idiosyncratic tail surprises.'
  },

  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    currency: '$',
    price: 425.20,
    priceFormatted: '$425.20',
    change: 6.10,
    changePercent: 1.45,
    volume: '22.8M',
    marketOpen: true,
    trendScore: 86,
    finbertSentiment: 0.85,
    riskScore: 42,
    riskCategory: 'LOW',
    sharpeRatio: 2.18,
    sortinoRatio: 2.62,
    confidence: 84,
    forecastDirection: 'BULLISH',
    expectedDelta: '+2.4% to +4.8%',
    targetRange: '$435.00 – $445.00',
    probabilities: {
      bullish: 84,
      neutral: 11,
      bearish: 5
    },
    invalidationLevel: '$412.00',
    resistanceLevel: '$430.00',
    volatilityAnn: 15.8,
    maxDrawdown: -10.4,
    var95: -1.65,
    varAmount: '$7.01 / share',
    beta: 0.91,
    downsideDev: 7.9,
    atr14: 6.40,
    atrAmount: '$6.40',
    factors: {
      volatility: { score: 2, label: 'Low-Medium (2/5)' },
      drawdown: { score: 1, label: 'Minimal (1/5)' },
      tailRisk: { score: 1, label: 'Low (1/5)' },
      marketBeta: { score: 2, label: 'Defensive (2/5)' },
      liquidity: { score: 1, label: 'Top Tier (1/5)' }
    },
    rsi: 65.4,
    macd: '+3.15 Cross',
    bollingerStatus: 'Expanding Upper Band',
    confirmationChecklist: [
      { id: '1', name: 'Azure Cloud Infrastructure Growth', status: '+31% YoY Run-Rate', isBullish: true, type: 'positive' },
      { id: '2', name: 'Copilot Enterprise Monetization', status: '65% Fortune 500 Active', isBullish: true, type: 'positive' },
      { id: '3', name: 'RSI Momentum Confirmation', status: '65.4 Bullish Zone', isBullish: true, type: 'positive' },
      { id: '4', name: 'Free Cash Flow Margin', status: '34% Structural FCF', isBullish: true, type: 'positive' },
      { id: '5', name: 'SMA 20 > SMA 50', status: 'Golden Cross Confirmation', isBullish: true, type: 'positive' }
    ],
    baselineLogOdds: 0.54,
    finalLogOdds: 1.58,
    netShap: '+1.04 net',
    shapFactors: [
      {
        name: 'Azure AI Enterprise Monetization',
        badge: '+31% YoY',
        value: 0.38,
        rawFormatted: '+0.38',
        description: 'Accelerating cloud consumption from enterprise generative AI deployment',
        isDrag: false
      },
      {
        name: 'Office 365 Copilot ARPU Uplift',
        badge: 'Enterprise E5',
        value: 0.28,
        rawFormatted: '+0.28',
        description: 'Seat expansion across enterprise commercial suites boosting blended ARPU',
        isDrag: false
      },
      {
        name: 'Operating Margin Expansion',
        badge: '44.6%',
        value: 0.22,
        rawFormatted: '+0.22',
        description: 'High software gross margins cushioning AI infrastructure CapEx depreciation',
        isDrag: false
      },
      {
        name: 'AI Infrastructure CapEx Buildout',
        badge: 'CapEx Surge',
        value: -0.12,
        rawFormatted: '-0.12',
        description: 'Near-term capital expenditure commitments on data center GPU clusters',
        isDrag: true
      }
    ],
    scenarios: [
      {
        title: 'Breakout to $445 Target Range',
        type: 'bull',
        probability: 64,
        description: 'Persistent cloud AI copilot adoption drives enterprise multiple expansion above $430 resistance.',
        targetOrBand: 'Target: $445.00',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 3.5'
      },
      {
        title: 'Sideways Base at $420-$430',
        type: 'base',
        probability: 28,
        description: 'Consolidation near all-time highs absorbs quarterly cloud CapEx disclosures.',
        targetOrBand: 'Band: $420.00 – $430.00',
        riskRewardOrStrategy: 'Strategy: Accumulation'
      },
      {
        title: 'Macro Multiple Retracement',
        type: 'bear',
        probability: 8,
        description: 'Treasury yields pressure high-multiple enterprise tech back to $412 support.',
        targetOrBand: 'Invalidation Level: $412.00',
        riskRewardOrStrategy: 'Buffer: -3.1%'
      }
    ],
    technicalNarrative: 'TreeSHAP models indicate dominant positive attribution from recurring SaaS subscription cash flows and enterprise cloud expansion.',
    eli5Narrative: 'Microsoft is seeing explosive demand for Azure cloud computing and AI Copilots, giving it strong institutional sponsorship and solid upside momentum.',
    vivaVaRLogic: '1-Day VaR at 95% indicates maximum expected single-day loss of $7.01 (1.65%), reflecting exceptional balance sheet quality.',
    vivaBetaLogic: 'Beta of 0.91 demonstrates resilience against aggressive tech drawdowns while retaining high secular earnings growth.'
  },

  ICICIBANK: {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Limited',
    exchange: 'NSE',
    currency: '₹',
    price: 1124.60,
    priceFormatted: '₹1,124.60',
    change: 9.40,
    changePercent: 0.85,
    volume: '9.80M',
    marketOpen: true,
    trendScore: 80,
    finbertSentiment: 0.76,
    riskScore: 54,
    riskCategory: 'MODERATE',
    sharpeRatio: 1.88,
    sortinoRatio: 2.24,
    confidence: 79,
    forecastDirection: 'BULLISH',
    expectedDelta: '+1.5% to +3.6%',
    targetRange: '₹1,145 – ₹1,170',
    probabilities: {
      bullish: 79,
      neutral: 14,
      bearish: 7
    },
    invalidationLevel: '₹1,095.00',
    resistanceLevel: '₹1,140',
    volatilityAnn: 17.2,
    maxDrawdown: -12.6,
    var95: -1.95,
    varAmount: '₹21.90 / share',
    beta: 1.05,
    downsideDev: 9.2,
    atr14: 14.80,
    atrAmount: '₹14.80',
    factors: {
      volatility: { score: 3, label: 'Moderate (3/5)' },
      drawdown: { score: 2, label: 'Controlled (2/5)' },
      tailRisk: { score: 2, label: 'Low (2/5)' },
      marketBeta: { score: 3, label: 'Market Tracking (3/5)' },
      liquidity: { score: 1, label: 'High (1/5)' }
    },
    rsi: 62.8,
    macd: '+4.20 Bull Cross',
    bollingerStatus: 'Ascending Midband',
    confirmationChecklist: [
      { id: '1', name: 'Core Operating Profit Growth', status: '+15.2% YoY', isBullish: true, type: 'positive' },
      { id: '2', name: 'Net Interest Margin (NIM)', status: 'Resilient at 4.40%', isBullish: true, type: 'positive' },
      { id: '3', name: 'Gross NPA Improvement', status: '2.15% Multi-Year Low', isBullish: true, type: 'positive' },
      { id: '4', name: 'Credit Growth Outperformance', status: '+16% System Outperformance', isBullish: true, type: 'positive' }
    ],
    baselineLogOdds: 0.44,
    finalLogOdds: 1.34,
    netShap: '+0.90 net',
    shapFactors: [
      {
        name: 'Domestic NIM Resilience',
        badge: '4.40% NIM',
        value: 0.32,
        rawFormatted: '+0.32',
        description: 'Superior retail deposit franchise protecting lending margins',
        isDrag: false
      },
      {
        name: 'Asset Quality Improvement',
        badge: 'GNPA 2.15%',
        value: 0.24,
        rawFormatted: '+0.24',
        description: 'Continual credit cost decline across retail and corporate book',
        isDrag: false
      }
    ],
    scenarios: [
      {
        title: 'Breakout Past ₹1,140 Resistance',
        type: 'bull',
        probability: 62,
        description: 'Continued retail loan growth and clean balance sheet catalyze re-rating toward ₹1,170.',
        targetOrBand: 'Target: ₹1,170.00',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 2.8'
      },
      {
        title: 'Channel Consolidation',
        type: 'base',
        probability: 30,
        description: 'Trading in ₹1,110 – ₹1,135 band following banking index sector rotation.',
        targetOrBand: 'Band: ₹1,110 – ₹1,135',
        riskRewardOrStrategy: 'Strategy: Range Play'
      },
      {
        title: 'Systemic Financial Retracement',
        type: 'bear',
        probability: 8,
        description: 'Tight banking liquidity pulls price toward ₹1,095 support.',
        targetOrBand: 'Invalidation Level: ₹1,095.00',
        riskRewardOrStrategy: 'Buffer: -2.6%'
      }
    ],
    technicalNarrative: 'XGBoost models show consistent positive feature weights on return on equity and superior credit underwriting.',
    eli5Narrative: 'ICICI Bank is delivering robust profit margins and clean loans, making it an analyst favorite in the Indian banking sector.',
    vivaVaRLogic: '1-Day VaR at 95% is -1.95%, reflecting strong sector-leading risk management.',
    vivaBetaLogic: 'Beta of 1.05 provides clean exposure to India macroeconomic growth.'
  },

  SBIN: {
    symbol: 'SBIN',
    name: 'State Bank of India',
    exchange: 'NSE',
    currency: '₹',
    price: 812.40,
    priceFormatted: '₹812.40',
    change: 9.20,
    changePercent: 1.15,
    volume: '16.5M',
    marketOpen: true,
    trendScore: 78,
    finbertSentiment: 0.72,
    riskScore: 56,
    riskCategory: 'MODERATE',
    sharpeRatio: 1.76,
    sortinoRatio: 2.10,
    confidence: 76,
    forecastDirection: 'BULLISH',
    expectedDelta: '+1.8% to +4.0%',
    targetRange: '₹830 – ₹850',
    probabilities: {
      bullish: 76,
      neutral: 16,
      bearish: 8
    },
    invalidationLevel: '₹788.00',
    resistanceLevel: '₹825',
    volatilityAnn: 19.5,
    maxDrawdown: -14.2,
    var95: -2.20,
    varAmount: '₹17.85 / share',
    beta: 1.18,
    downsideDev: 10.4,
    atr14: 12.20,
    atrAmount: '₹12.20',
    factors: {
      volatility: { score: 3, label: 'Moderate (3/5)' },
      drawdown: { score: 3, label: 'Moderate (3/5)' },
      tailRisk: { score: 2, label: 'Low (2/5)' },
      marketBeta: { score: 4, label: 'High Beta (4/5)' },
      liquidity: { score: 1, label: 'Highest Tier (1/5)' }
    },
    rsi: 61.2,
    macd: '+2.80 Bullish',
    bollingerStatus: 'Expanding North',
    confirmationChecklist: [
      { id: '1', name: 'Credit Delivery Pace', status: '+15.5% YoY Loan Growth', isBullish: true, type: 'positive' },
      { id: '2', name: 'RoA Trajectory', status: 'Stable > 1.0% RoA', isBullish: true, type: 'positive' },
      { id: '3', name: 'Government Capex Beneficiary', status: 'Infrastructure Inflow Lead', isBullish: true, type: 'positive' }
    ],
    baselineLogOdds: 0.38,
    finalLogOdds: 1.22,
    netShap: '+0.84 net',
    shapFactors: [
      {
        name: 'Corporate Lending Capex Cycle',
        badge: '+15.5% YoY',
        value: 0.30,
        rawFormatted: '+0.30',
        description: 'Sovereign and public sector infrastructure spending boosting balance sheet',
        isDrag: false
      },
      {
        name: 'SME & Agricultural Loan Health',
        badge: 'Low Slippage',
        value: 0.22,
        rawFormatted: '+0.22',
        description: 'Controlled non-performing asset formation across rural and SME portfolios',
        isDrag: false
      }
    ],
    scenarios: [
      {
        title: 'Run toward ₹850 Level',
        type: 'bull',
        probability: 60,
        description: 'State-owned banking re-rating propels SBIN past ₹825 resistance toward ₹850.',
        targetOrBand: 'Target: ₹850.00',
        riskRewardOrStrategy: 'Risk/Reward: 1 : 2.5'
      },
      {
        title: 'Range Bound ₹800-₹825',
        type: 'base',
        probability: 30,
        description: 'Sideways consolidation around the ₹810 median.',
        targetOrBand: 'Band: ₹800.00 – ₹825.00',
        riskRewardOrStrategy: 'Strategy: Swing Pivot'
      },
      {
        title: 'PSU Retracement',
        type: 'bear',
        probability: 10,
        description: 'PSU profit-booking tests ₹788 invalidation floor.',
        targetOrBand: 'Invalidation Level: ₹788.00',
        riskRewardOrStrategy: 'Buffer: -3.0%'
      }
    ],
    technicalNarrative: 'Positive SHAP drivers stem from high return on equity and India infrastructure financing dominance.',
    eli5Narrative: 'SBI is India’s largest public bank, benefiting directly from national infrastructure spending and expanding retail credit.',
    vivaVaRLogic: '1-Day VaR at 95% is -2.20%, typical for high-volume banking institutions.',
    vivaBetaLogic: 'Beta of 1.18 gives amplified returns during Indian macro bull cycles.'
  }
};

export const CORE_HOLDINGS: PortfolioHolding[] = [
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    qty: 42,
    avgBuy: 3361.50,
    avgBuyFormatted: '₹3,361.50',
    curPrice: 3980.10,
    curPriceFormatted: '₹3,980.10',
    curValue: 167164.20,
    curValueFormatted: '₹1,67,164.20',
    pnlPercent: 18.40,
    pnlFormatted: '+18.40% (₹26,120)',
    direction: 'BULLISH',
    directionProb: 78,
    riskVector: 'Low (38)',
    riskVectorColor: 'Low',
    shapDriver: 'Cross-Currency Margins',
    dividendYield: 1.96,
    dps: 78.00,
    payoutRatio: 48.2
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    exchange: 'NSE',
    qty: 55,
    avgBuy: 2689.80,
    avgBuyFormatted: '₹2,689.80',
    curPrice: 2910.45,
    curPriceFormatted: '₹2,910.45',
    curValue: 160074.75,
    curValueFormatted: '₹1,60,074.75',
    pnlPercent: 8.20,
    pnlFormatted: '+8.20% (+₹12,140)',
    direction: 'BULLISH',
    directionProb: 82,
    riskVector: 'Med (52)',
    riskVectorColor: 'Med',
    shapDriver: 'GRM Spread Inflow',
    dividendYield: 0.34,
    dps: 10.00,
    payoutRatio: 14.8
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    exchange: 'NSE',
    qty: 60,
    avgBuy: 1475.60,
    avgBuyFormatted: '₹1,475.60',
    curPrice: 1440.30,
    curPriceFormatted: '₹1,440.30',
    curValue: 86418.00,
    curValueFormatted: '₹86,418.00',
    pnlPercent: -2.40,
    pnlFormatted: '-2.40% (-₹2,120)',
    direction: 'NEUTRAL',
    directionProb: 61,
    riskVector: 'Med (62)',
    riskVectorColor: 'Med',
    shapDriver: 'Deposit Cost Pressure',
    dividendYield: 1.35,
    dps: 19.50,
    payoutRatio: 24.5
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    exchange: 'NSE',
    qty: 45,
    avgBuy: 1261.25,
    avgBuyFormatted: '₹1,261.25',
    curPrice: 1528.70,
    curPriceFormatted: '₹1,528.70',
    curValue: 68791.50,
    curValueFormatted: '₹68,791.50',
    pnlPercent: 21.20,
    pnlFormatted: '+21.20% (+₹12,045)',
    direction: 'BULLISH',
    directionProb: 74,
    riskVector: 'Low (41)',
    riskVectorColor: 'Low',
    shapDriver: 'Large Deal TCV Renewal',
    dividendYield: 2.35,
    dps: 36.00,
    payoutRatio: 62.4
  }
];

export const PORTFOLIO_DIVIDEND_DETAILS: Record<string, {
  dividendYield: number;
  dps: number;
  payoutRatio: number;
  growth3Y: number;
  fcfCoverage: number;
  frequency: 'Quarterly' | 'Semi-Annual' | 'Annual';
  nextExDate: string;
  nextPayoutPerShare: number;
  safetyScore: number;
  safetyRating: 'Very Safe' | 'Safe' | 'Moderate' | 'High Risk';
  payoutSchedule: { monthIndex: number; dpsPortion: number }[];
}> = {
  TCS: {
    dividendYield: 1.96,
    dps: 78.00,
    payoutRatio: 48.2,
    growth3Y: 14.2,
    fcfCoverage: 2.1,
    frequency: 'Quarterly',
    nextExDate: 'Oct 19, 2026',
    nextPayoutPerShare: 12.00,
    safetyScore: 96,
    safetyRating: 'Very Safe',
    payoutSchedule: [
      { monthIndex: 0, dpsPortion: 12.00 }, // Jan
      { monthIndex: 4, dpsPortion: 30.00 }, // May
      { monthIndex: 6, dpsPortion: 24.00 }, // Jul
      { monthIndex: 9, dpsPortion: 12.00 }  // Oct
    ]
  },
  RELIANCE: {
    dividendYield: 0.34,
    dps: 10.00,
    payoutRatio: 14.8,
    growth3Y: 8.5,
    fcfCoverage: 3.4,
    frequency: 'Annual',
    nextExDate: 'Aug 18, 2026',
    nextPayoutPerShare: 10.00,
    safetyScore: 92,
    safetyRating: 'Very Safe',
    payoutSchedule: [
      { monthIndex: 7, dpsPortion: 10.00 }  // Aug
    ]
  },
  HDFCBANK: {
    dividendYield: 1.35,
    dps: 19.50,
    payoutRatio: 24.5,
    growth3Y: 18.0,
    fcfCoverage: 2.8,
    frequency: 'Annual',
    nextExDate: 'Jul 15, 2026',
    nextPayoutPerShare: 19.50,
    safetyScore: 89,
    safetyRating: 'Safe',
    payoutSchedule: [
      { monthIndex: 6, dpsPortion: 19.50 }  // Jul
    ]
  },
  INFY: {
    dividendYield: 2.35,
    dps: 36.00,
    payoutRatio: 62.4,
    growth3Y: 11.8,
    fcfCoverage: 1.6,
    frequency: 'Semi-Annual',
    nextExDate: 'Oct 26, 2026',
    nextPayoutPerShare: 18.00,
    safetyScore: 88,
    safetyRating: 'Safe',
    payoutSchedule: [
      { monthIndex: 5, dpsPortion: 18.00 }, // Jun
      { monthIndex: 9, dpsPortion: 18.00 }  // Oct
    ]
  }
};

export const WATCHLIST_ITEMS: WatchlistItem[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    emoji: '🍎',
    price: '$189.45',
    change: '+1.24%',
    isPositive: true,
    mlDirection: 'Bullish 81%',
    riskVector: 'Low-Med 44',
    xaiSignal: 'Upward Trend',
    attention: 'Services Revenue CAGR'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    exchange: 'NASDAQ',
    emoji: '⚡',
    price: '$178.20',
    change: '-1.85%',
    isPositive: false,
    mlDirection: 'Bearish 68%',
    riskVector: 'High 74',
    xaiSignal: 'Breakdown Alert',
    attention: 'Margin Squeeze Sentiment'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    emoji: '🧠',
    price: '$894.20',
    change: '+3.12%',
    isPositive: true,
    mlDirection: 'Bullish 89%',
    riskVector: 'Medium 58',
    xaiSignal: 'Volume Expansion',
    attention: 'Data Center Backlog'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    emoji: '💻',
    price: '$428.15',
    change: '+2.15%',
    isPositive: true,
    mlDirection: 'Bullish 84%',
    riskVector: 'Low 38',
    xaiSignal: 'Azure Cloud Expansion',
    attention: 'Copilot Enterprise Monetization'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    emoji: '🏢',
    price: '₹3,924.50',
    change: '+1.24%',
    isPositive: true,
    mlDirection: 'Bullish 78%',
    riskVector: 'Moderate 62',
    xaiSignal: 'Golden Cross Momentum',
    attention: 'Q4 Deal Book Bookings'
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    exchange: 'NSE',
    emoji: '🛢️',
    price: '₹2,910.45',
    change: '+0.77%',
    isPositive: true,
    mlDirection: 'Bullish 82%',
    riskVector: 'Medium 52',
    xaiSignal: 'Refining Margin Spread',
    attention: 'Retail & 5G Monetization'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    exchange: 'NSE',
    emoji: '🌐',
    price: '₹1,528.70',
    change: '+1.10%',
    isPositive: true,
    mlDirection: 'Bullish 74%',
    riskVector: 'Low 41',
    xaiSignal: 'Accumulation Channel',
    attention: 'Cloud Enterprise Renewals'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    exchange: 'NSE',
    emoji: '🏦',
    price: '₹1,440.30',
    change: '-0.65%',
    isPositive: false,
    mlDirection: 'Neutral 61%',
    riskVector: 'Medium 62',
    xaiSignal: 'Consolidation Support',
    attention: 'Post-Merger Deposit Ratio'
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Limited',
    exchange: 'NSE',
    emoji: '📈',
    price: '₹1,124.60',
    change: '+0.85%',
    isPositive: true,
    mlDirection: 'Bullish 79%',
    riskVector: 'Moderate 54',
    xaiSignal: 'Credit Growth Inflow',
    attention: 'NIM Stability Horizon'
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    exchange: 'NSE',
    emoji: '🏛️',
    price: '₹762.30',
    change: '+1.95%',
    isPositive: true,
    mlDirection: 'Bullish 83%',
    riskVector: 'Moderate 57',
    xaiSignal: 'PSU Banking Re-rating',
    attention: 'Asset Quality Improvement'
  }
];

export const MARKET_TICKER_ITEMS = [
  { symbol: 'NIFTY 50', price: '22,410.80', change: '+0.82%', isPositive: true },
  { symbol: 'AAPL', price: '$189.45', change: '+1.24%', isPositive: true },
  { symbol: 'TCS', price: '₹3,980.10', change: '-0.34%', isPositive: false },
  { symbol: 'TSLA', price: '$178.60', change: '+3.15%', isPositive: true },
  { symbol: 'NVDA', price: '$894.20', change: '+3.12%', isPositive: true },
  { symbol: 'RELIANCE', price: '₹2,910.45', change: '+0.77%', isPositive: true },
  { symbol: 'INFY', price: '₹1,528.70', change: '+1.10%', isPositive: true }
];
