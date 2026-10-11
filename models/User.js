import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'analyst'],
      default: 'user',
    },
    watchlist: [
      {
        type: String,
        uppercase: true,
        trim: true,
      },
    ],
    preferences: {
      theme: {
        type: String,
        enum: ['dark', 'light', 'system'],
        default: 'dark',
      },
      defaultMarket: {
        type: String,
        enum: ['NSE', 'BSE', 'NASDAQ', 'NYSE'],
        default: 'NSE',
      },
      defaultPredictionHorizon: {
        type: String,
        enum: ['1D', '5D', '1M', '3M'],
        default: '5D',
      },
      engineeringVivaMode: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
