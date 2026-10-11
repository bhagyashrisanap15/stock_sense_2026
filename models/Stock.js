import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    exchange: {
      type: String,
      required: [true, 'Exchange is required'],
      enum: ['NSE', 'BSE', 'NASDAQ', 'NYSE'],
      uppercase: true,
      trim: true,
    },
    sector: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ['INR', 'USD', 'EUR', 'GBP'],
      default: 'INR',
    },
    market: {
      type: String,
      required: true,
      enum: ['India', 'United States', 'Global'],
      default: 'India',
    },
    description: {
      type: String,
      default: '',
    },
    marketCapCategory: {
      type: String,
      enum: ['LARGE_CAP', 'MID_CAP', 'SMALL_CAP', 'MEGA_CAP'],
      default: 'LARGE_CAP',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

stockSchema.index({ symbol: 1 }, { unique: true });
stockSchema.index({ exchange: 1, sector: 1 });
stockSchema.index({ market: 1 });

const Stock = mongoose.models.Stock || mongoose.model('Stock', stockSchema);
export default Stock;
