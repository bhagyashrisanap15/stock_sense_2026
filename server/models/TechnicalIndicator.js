import mongoose from 'mongoose';

const technicalIndicatorSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    sma20: { type: Number, required: true },
    sma50: { type: Number, required: true },
    sma200: { type: Number, required: true },
    ema20: { type: Number, required: true },
    ema50: { type: Number, required: true },
    rsi: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    macd: { type: Number, required: true },
    macdSignal: { type: Number, required: true },
    macdHistogram: { type: Number, required: true },
    bollingerUpper: { type: Number, required: true },
    bollingerMiddle: { type: Number, required: true },
    bollingerLower: { type: Number, required: true },
    atr: { type: Number, required: true },
    obv: { type: Number, required: true },
    stochastic: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    trendSignal: {
      type: String,
      enum: ['BULLISH', 'BEARISH', 'NEUTRAL'],
      default: 'NEUTRAL',
      required: true,
    },
    dataSource: {
      type: String,
      enum: ['DEMO', 'CALCULATED_LIVE'],
      default: 'DEMO',
    },
  },
  {
    timestamps: true,
  }
);

technicalIndicatorSchema.index({ symbol: 1, date: -1 }, { unique: true });

const TechnicalIndicator =
  mongoose.models.TechnicalIndicator ||
  mongoose.model('TechnicalIndicator', technicalIndicatorSchema);
export default TechnicalIndicator;
