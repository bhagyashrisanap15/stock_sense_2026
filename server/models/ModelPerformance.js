import mongoose from 'mongoose';

const modelPerformanceSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
      trim: true,
    },
    version: {
      type: String,
      required: true,
      trim: true,
    },
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    precision: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    recall: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    f1Score: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    rocAuc: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    logLoss: {
      type: Number,
      default: 0.384,
    },
    confusionMatrix: {
      truePositive: { type: Number, default: 842 },
      trueNegative: { type: Number, default: 1422 },
      falsePositive: { type: Number, default: 114 },
      falseNegative: { type: Number, default: 72 },
    },
    trainingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    datasetSize: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'BENCHMARK', 'RETIRED'],
      default: 'BENCHMARK',
      required: true,
    },
    dataSource: {
      type: String,
      enum: ['DEMO', 'OFFLINE_TRAINING_RUN'],
      default: 'DEMO',
    },
  },
  {
    timestamps: true,
  }
);

modelPerformanceSchema.index({ model: 1, version: 1 }, { unique: true });
modelPerformanceSchema.index({ status: 1 });

const ModelPerformance =
  mongoose.models.ModelPerformance ||
  mongoose.model('ModelPerformance', modelPerformanceSchema);
export default ModelPerformance;
