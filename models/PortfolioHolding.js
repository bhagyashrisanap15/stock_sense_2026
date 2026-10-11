import mongoose from 'mongoose';

const portfolioHoldingSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: [true, 'Portfolio ID reference is required'],
      index: true,
    },
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    averagePurchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    investedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentValue: {
      type: Number,
      required: true,
      min: 0,
    },
    profitLoss: {
      type: Number,
      required: true,
    },
    returnPercentage: {
      type: Number,
      required: true,
    },
    riskVector: {
      type: String,
      default: 'Moderate (50)',
    },
    shapDriver: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

portfolioHoldingSchema.index({ portfolioId: 1, symbol: 1 });

const PortfolioHolding =
  mongoose.models.PortfolioHolding ||
  mongoose.model('PortfolioHolding', portfolioHoldingSchema);
export default PortfolioHolding;
