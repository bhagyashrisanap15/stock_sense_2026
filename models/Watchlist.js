import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Watchlist name is required'],
      trim: true,
      default: 'Primary Watchlist',
    },
    symbols: [
      {
        type: String,
        uppercase: true,
        trim: true,
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

watchlistSchema.index({ userId: 1 });

const Watchlist =
  mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;
