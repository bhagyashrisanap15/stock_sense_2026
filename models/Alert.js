import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      index: true,
    },
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['PRICE', 'RSI', 'RISK', 'TREND_CHANGE', 'VOLATILITY', 'PREDICTION'],
      required: true,
    },
    condition: {
      type: String,
      required: true, // e.g. 'GREATER_THAN', 'LESS_THAN', 'BULLISH', 'BEARISH'
      trim: true,
    },
    threshold: {
      type: Number,
      default: null, // e.g. 4000 for price, 70 for RSI, or null for trend change
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    triggeredAt: {
      type: Date,
      default: null,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ userId: 1, active: 1 });
alertSchema.index({ symbol: 1, active: 1 });

const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema);
export default Alert;
