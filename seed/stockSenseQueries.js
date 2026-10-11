/**
 * StockSense AI – MongoDB Compass & mongosh Query Reference Sheet
 * Final-Year Engineering Project
 * 
 * You can execute these commands directly in the MongoDB Compass embedded mongosh terminal
 * or via standard mongosh CLI connected to your MongoDB Atlas cluster.
 * 
 * Shell prompt format:
 * Atlas atlas-xxxx-shard-0 [primary] stockSenseAI>
 */

// ==============================================================================
// 1. DATABASE SETUP & INSPECTION
// ==============================================================================

// Switch to the project database
// use stockSenseAI

// View all 16 collections
// show collections

// Check collection count stats
// db.getCollectionNames().forEach(c => print(`${c}: ${db[c].countDocuments()} docs`))


// ==============================================================================
// 2. CORE STOCKS QUERIES
// ==============================================================================

// List all tracked stocks
// db.stocks.find().pretty()

// Find specific stock by ticker
// db.stocks.find({ symbol: "TCS" })

// Find all Indian NSE stocks
// db.stocks.find({ exchange: "NSE" }, { symbol: 1, companyName: 1, sector: 1 })

// Find all US Mega-Cap stocks
// db.stocks.find({ market: "United States", marketCapCategory: "MEGA_CAP" })


// ==============================================================================
// 3. PREDICTIONS & XAI ATTRIBUTIONS (ML Horizon Forecast)
// ==============================================================================

// Find latest ML prediction for TCS
// db.predictions.find({ symbol: "TCS" })

// Filter all stocks with BULLISH forecast and high confidence
/*
db.predictions.find(
  {
    prediction: "BULLISH",
    confidence: { $gte: 75 }
  },
  {
    symbol: 1,
    prediction: 1,
    confidence: 1,
    expectedDelta: 1,
    targetRange: 1
  }
).sort({ confidence: -1 })
*/

// Inspect top TreeSHAP features driving TCS prediction
/*
db.predictions.find(
  { symbol: "TCS" },
  {
    symbol: 1,
    prediction: 1,
    "topFeatures.feature": 1,
    "topFeatures.contribution": 1,
    "topFeatures.impact": 1
  }
)
*/


// ==============================================================================
// 4. RISK ASSESSMENTS & STRESS ENGINE
// ==============================================================================

// Inspect quantitative risk metrics for TCS
// db.riskAssessments.find({ symbol: "TCS" })

// Find all stocks classified as HIGH or VERY HIGH risk
/*
db.riskAssessments.find({
  riskLevel: { $in: ["HIGH", "VERY HIGH"] }
}, {
  symbol: 1,
  riskScore: 1,
  riskLevel: 1,
  volatility: 1,
  maximumDrawdown: 1,
  valueAtRisk: 1
})
*/

// Find stocks with optimal risk-adjusted returns (Sharpe > 1.7)
/*
db.riskAssessments.find(
  { sharpeRatio: { $gte: 1.7 } },
  { symbol: 1, sharpeRatio: 1, sortinoRatio: 1, beta: 1 }
).sort({ sharpeRatio: -1 })
*/


// ==============================================================================
// 5. GOOGLE GEMINI ADVANCED AI ANALYSES
// ==============================================================================

// Retrieve complete Gemini XAI intelligence dossier for TCS
// db.aiAnalyses.find({ symbol: "TCS" })

// Find high-intelligence score stocks (aiTrendIntelligenceScore >= 75)
/*
db.aiAnalyses.find({
  aiTrendIntelligenceScore: { $gte: 75 }
}, {
  symbol: 1,
  aiTrendIntelligenceScore: 1,
  "trendAnalysis.direction": 1,
  "trendAnalysis.confidence": 1,
  trendWarning: 1
}).sort({ aiTrendIntelligenceScore: -1 })
*/

// Read plain-English (ELI5) beginner explanation for viva demonstration
/*
db.aiAnalyses.find(
  { symbol: "TCS" },
  { symbol: 1, beginnerExplanation: 1, bullCase: 1, bearCase: 1 }
)
*/


// ==============================================================================
// 6. TECHNICAL INDICATORS & MOMENTUM TELEMETRY
// ==============================================================================

// Inspect technical indicator indicators for TCS
// db.technicalIndicators.find({ symbol: "TCS" })

// Golden Cross filter (SMA 20 > SMA 50) with RSI in bullish zone
/*
db.technicalIndicators.find({
  $expr: { $gt: ["$sma20", "$sma50"] },
  rsi: { $gte: 60, $lte: 70 }
}, {
  symbol: 1,
  sma20: 1,
  sma50: 1,
  rsi: 1,
  trendSignal: 1
})
*/


// ==============================================================================
// 7. SENTIMENT ANALYSES (FinBERT NLP)
// ==============================================================================

// Inspect sentiment metrics for TCS
// db.sentimentAnalyses.find({ symbol: "TCS" })

// Find top positive sentiment stocks
/*
db.sentimentAnalyses.find(
  { overallSentiment: "POSITIVE" },
  { symbol: 1, sentimentScore: 1, positive: 1 }
).sort({ sentimentScore: -1 })
*/


// ==============================================================================
// 8. HISTORICAL PRICES (Time-Series)
// ==============================================================================

// Query trailing daily OHLCV prices for TCS
/*
db.historicalPrices.find(
  { symbol: "TCS" }
).sort({ date: -1 }).limit(10)
*/


// ==============================================================================
// 9. MODEL PERFORMANCE & VALIDATION LOGS
// ==============================================================================

// View all ensemble candidate models and accuracy benchmarks
// db.modelPerformance.find().pretty()

// View active production engine metrics
/*
db.modelPerformance.find(
  { status: "ACTIVE" },
  {
    model: 1,
    version: 1,
    accuracy: 1,
    precision: 1,
    f1Score: 1,
    rocAuc: 1,
    logLoss: 1,
    confusionMatrix: 1
  }
)
*/


// ==============================================================================
// 10. PREDICTION ACCURACY & OUTCOME AUDIT
// ==============================================================================

// View resolution history for TCS
// db.predictionHistory.find({ symbol: "TCS" })

// Calculate historical model accuracy percentage
/*
db.predictionHistory.aggregate([
  {
    $group: {
      _id: "$model",
      totalPredictions: { $sum: 1 },
      correctPredictions: {
        $sum: { $cond: [{ $eq: ["$wasCorrect", true] }, 1, 0] }
      }
    }
  },
  {
    $project: {
      model: "$_id",
      totalPredictions: 1,
      correctPredictions: 1,
      accuracyPercent: {
        $multiply: [
          { $divide: ["$correctPredictions", "$totalPredictions"] },
          100
        ]
      }
    }
  }
])
*/


// ==============================================================================
// 11. MARKET REGIMES & MACRO ANOMALY WATCH
// ==============================================================================

// Query current macro regime classification
// db.marketRegimes.find()


// ==============================================================================
// 12. PORTFOLIOS & ACTIVE HOLDINGS
// ==============================================================================

// View all user portfolios
// db.portfolios.find()

// View portfolio holdings with profit/loss metrics
// db.portfolioHoldings.find()

// Find active risk alerts
// db.alerts.find({ active: true })

// Find generated audit dossiers
// db.reports.find()
