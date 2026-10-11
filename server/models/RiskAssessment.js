import mongoose from 'mongoose';

const riskAssessmentSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'],
      required: true,
      index: true,
    },
    volatility: {
      type: Number,
      required: true, // Annualized volatility, e.g. 0.184 (18.4%)
    },
    maximumDrawdown: {
      type: Number,
      required: true, // Peak-to-trough drop, e.g. -0.142 (-14.2%)
    },
    valueAtRisk: {
      type: Number,
      required: true, // 1-Day 95% VaR, e.g. -0.021 (-2.1%)
    },
    beta: {
      type: Number,
      required: true, // Sensitivity vs market index, e.g. 0.88
    },
    sharpeRatio: {
      type: Number,
      required: true, // Excess return per total vol, e.g. 1.74
    },
    sortinoRatio: {
      type: Number,
      required: true, // Excess return per downside semi-variance, e.g. 2.12
    },
    atr: {
      type: Number,
      required: true, // Average True Range (14)
    },
    downsideDeviation: {
      type: Number,
      required: true, // Semi-variance downside standard deviation
    },
    assessmentPeriod: {
      type: String,
      enum: ['1M', '3M', '6M', '1Y', '3Y'],
      default: '1Y',
      required: true,
    },
    weightsBreakdown: {
      historicalVolatility: { type: Number, default: 0.25 },
      maxDrawdown: { type: Number, default: 0.20 },
      valueAtRisk: { type: Number, default: 0.20 },
      downsideSemiDev: { type: Number, default: 0.10 },
      marketBeta: { type: Number, default: 0.10 },
      sharpeSortino: { type: Number, default: 0.10 },
      atr: { type: Number, default: 0.05 },
    },
    dataSource: {
      type: String,
      enum: ['DEMO', 'QUANT_ENGINE'],
      default: 'DEMO',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to compute risk level automatically if not explicitly provided
riskAssessmentSchema.pre('save', function (next) {
  if (this.riskScore !== undefined && !this.riskLevel) {
    if (this.riskScore <= 30) this.riskLevel = 'LOW';
    else if (this.riskScore <= 60) this.riskLevel = 'MEDIUM';
    else if (this.riskScore <= 80) this.riskLevel = 'HIGH';
    else this.riskLevel = 'VERY HIGH';
  }
  next();
});

riskAssessmentSchema.index({ symbol: 1, createdAt: -1 });
riskAssessmentSchema.index({ riskLevel: 1 });

const RiskAssessment =
  mongoose.models.RiskAssessment ||
  mongoose.model('RiskAssessment', riskAssessmentSchema);
export default RiskAssessment;
