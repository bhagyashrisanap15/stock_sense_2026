import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
    },
    trendAnalysis: {
      direction: {
        type: String,
        enum: ['BULLISH', 'BEARISH', 'NEUTRAL'],
        required: true,
      },
      confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      reasoning: {
        type: String,
        required: true,
      },
    },
    riskAnalysis: {
      level: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'],
        required: true,
      },
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      reasoning: {
        type: String,
        required: true,
      },
    },
    technicalAnalysis: {
      rsi: { type: String, default: '' },
      macd: { type: String, default: '' },
      movingAverage: { type: String, default: '' },
      volume: { type: String, default: '' },
    },
    modelExplanation: [
      {
        type: String,
      },
    ],
    sentimentAnalysis: {
      sentiment: {
        type: String,
        enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
        required: true,
      },
      score: {
        type: Number,
        required: true,
        min: -1,
        max: 1,
      },
    },
    trendWarning: {
      type: String,
      default: '',
    },
    bullCase: {
      type: String,
      required: true,
    },
    baseCase: {
      type: String,
      required: true,
    },
    bearCase: {
      type: String,
      required: true,
    },
    keyRisks: [
      {
        type: String,
      },
    ],
    keySignals: [
      {
        type: String,
      },
    ],
    beginnerExplanation: {
      type: String,
      required: true,
    },
    aiTrendIntelligenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    generatedBy: {
      type: String,
      default: 'Gemini AI',
    },
    dataSource: {
      type: String,
      enum: ['DEMO', 'GEMINI_API_LIVE'],
      default: 'DEMO',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

aiAnalysisSchema.index({ symbol: 1, createdAt: -1 });
aiAnalysisSchema.index({ aiTrendIntelligenceScore: -1 });

const AIAnalysis =
  mongoose.models.AIAnalysis || mongoose.model('AIAnalysis', aiAnalysisSchema);
export default AIAnalysis;
