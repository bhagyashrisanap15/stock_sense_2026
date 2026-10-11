import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
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
    reportType: {
      type: String,
      enum: [
        'AUDIT_DOSSIER',
        'RISK_SUMMARY',
        'TECHNICAL_DEEP_DIVE',
        'PREDICTION_AUDIT',
        'PORTFOLIO_STRESS_TEST',
      ],
      required: true,
      default: 'AUDIT_DOSSIER',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    predictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prediction',
      default: null,
    },
    riskAssessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskAssessment',
      default: null,
    },
    aiAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIAnalysis',
      default: null,
    },
    fileFormat: {
      type: String,
      enum: ['JSON', 'PDF', 'MARKDOWN'],
      default: 'JSON',
    },
    reportContent: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ symbol: 1, reportType: 1 });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;
