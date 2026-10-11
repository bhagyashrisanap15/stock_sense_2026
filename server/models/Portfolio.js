import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Portfolio name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    totalInvested: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    currentValue: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    profitLoss: {
      type: Number,
      required: true,
      default: 0,
    },
    returnPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    diversificationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
    },
    portfolioBeta: {
      type: Number,
      default: 1.0,
    },
    sharpeRatio: {
      type: Number,
      default: 1.5,
    },
  },
  {
    timestamps: true,
  }
);

portfolioSchema.index({ userId: 1 });

const Portfolio =
  mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
