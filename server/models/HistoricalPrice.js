import mongoose from 'mongoose';

const historicalPriceSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Price date is required'],
      index: true,
    },
    open: {
      type: Number,
      required: true,
      min: [0, 'Open price cannot be negative'],
    },
    high: {
      type: Number,
      required: true,
      min: [0, 'High price cannot be negative'],
    },
    low: {
      type: Number,
      required: true,
      min: [0, 'Low price cannot be negative'],
    },
    close: {
      type: Number,
      required: true,
      min: [0, 'Close price cannot be negative'],
    },
    adjustedClose: {
      type: Number,
      required: true,
      min: [0, 'Adjusted close cannot be negative'],
    },
    volume: {
      type: Number,
      required: true,
      min: [0, 'Volume cannot be negative'],
    },
    dataSource: {
      type: String,
      enum: ['DEMO', 'YAHOO_FINANCE', 'NSE_LIVE', 'ALPHA_VANTAGE', 'POLYGON'],
      default: 'DEMO',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one price record per symbol per date
historicalPriceSchema.index({ symbol: 1, date: -1 }, { unique: true });

const HistoricalPrice =
  mongoose.models.HistoricalPrice ||
  mongoose.model('HistoricalPrice', historicalPriceSchema);
export default HistoricalPrice;
