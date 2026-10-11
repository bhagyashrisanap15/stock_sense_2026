import mongoose from 'mongoose';

const topFeatureSchema = new mongoose.Schema(
  {
    feature: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    impact: {
      type: String,
      enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
      required: true,
    },
    contribution: {
      type: Number,
      required: true, // SHAP attribution value e.g. +0.28, -0.12
    },
    description: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const predictionSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    prediction: {
      type: String,
      enum: ['BULLISH', 'BEARISH', 'NEUTRAL'],
      required: true,
      index: true,
    },
    probabilities: {
      bullish: {
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
      bearish: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    predictionHorizon: {
      type: String,
      enum: ['1D', '5D', '1M', '3M'],
      default: '5D',
      required: true,
    },
    expectedDelta: {
      type: String,
      default: '+1.6% to +3.4%',
    },
    targetRange: {
      type: String,
      default: '',
    },
    model: {
      type: String,
      required: true,
      enum: ['XGBoost', 'Bi-LSTM', 'Random Forest', 'Ensemble Stack'],
      default: 'XGBoost',
    },
    modelVersion: {
      type: String,
      default: '2.4.0',
    },
    topFeatures: [topFeatureSchema],
    predictionDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    dataSource: {
      type: String,
      enum: ['DEMO', 'ML_PIPELINE'],
      default: 'DEMO',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

predictionSchema.index({ symbol: 1, predictionDate: -1 });
predictionSchema.index({ prediction: 1, confidence: -1 });

const Prediction =
  mongoose.models.Prediction || mongoose.model('Prediction', predictionSchema);
export default Prediction;
