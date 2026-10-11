import mongoose from 'mongoose';

const headlineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
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
    source: {
      type: String,
      default: 'Demo Financial Wire',
    },
  },
  { _id: false }
);

const sentimentAnalysisSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    positive: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    neutral: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    negative: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    sentimentScore: {
      type: Number,
      required: true, // Normalized FinBERT compound score (-1.0 to +1.0)
      min: -1,
      max: 1,
    },
    overallSentiment: {
      type: String,
      enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
      required: true,
      index: true,
    },
    headlines: [headlineSchema],
    analysisDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    dataSource: {
      type: String,
      enum: ['DEMO', 'FINBERT_LIVE', 'NEWS_API'],
      default: 'DEMO',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

sentimentAnalysisSchema.index({ symbol: 1, analysisDate: -1 });

const SentimentAnalysis =
  mongoose.models.SentimentAnalysis ||
  mongoose.model('SentimentAnalysis', sentimentAnalysisSchema);
export default SentimentAnalysis;
