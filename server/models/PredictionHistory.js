import mongoose from 'mongoose';

const predictionHistorySchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    predictionDate: {
      type: Date,
      required: true,
      index: true,
    },
    prediction: {
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
    actualOutcome: {
      type: String,
      enum: ['BULLISH', 'BEARISH', 'NEUTRAL', 'PENDING'],
      required: true,
    },
    wasCorrect: {
      type: Boolean,
      default: null,
    },
    model: {
      type: String,
      required: true,
      default: 'XGBoost',
    },
    horizon: {
      type: String,
      enum: ['1D', '5D', '1M', '3M'],
      default: '5D',
      required: true,
    },
    priceAtPrediction: {
      type: Number,
    },
    priceAtResolution: {
      type: Number,
    },
    returnDeltaPercent: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

predictionHistorySchema.index({ symbol: 1, predictionDate: -1 });
predictionHistorySchema.index({ wasCorrect: 1 });
predictionHistorySchema.index({ model: 1 });

const PredictionHistory =
  mongoose.models.PredictionHistory ||
  mongoose.model('PredictionHistory', predictionHistorySchema);
export default PredictionHistory;
