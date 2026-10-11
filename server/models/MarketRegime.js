import mongoose from 'mongoose';

const marketRegimeSchema = new mongoose.Schema(
  {
    market: {
      type: String,
      required: true,
      trim: true,
    },
    index: {
      type: String,
      required: true,
      trim: true,
    },
    regime: {
      type: String,
      enum: [
        'BULL_MARKET',
        'BEAR_MARKET',
        'SIDEWAYS',
        'HIGH_VOLATILITY',
        'LOW_VOLATILITY',
        'RECOVERY',
        'DISTRIBUTION',
      ],
      required: true,
    },
    volatilityLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'],
      required: true,
    },
    trendStrength: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    divergenceAnomaly: {
      type: String,
      default: 'Zero Critical Found',
    },
    dataSource: {
      type: String,
      enum: ['DEMO', 'LIVE_MACRO_FEED'],
      default: 'DEMO',
      required: true,
    },
    analysisDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

marketRegimeSchema.index({ market: 1, index: 1, analysisDate: -1 });

const MarketRegime =
  mongoose.models.MarketRegime ||
  mongoose.model('MarketRegime', marketRegimeSchema);
export default MarketRegime;
