import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['resume_analysis', 'jd_match', 'cover_letter', 'interview_prep', 'voice_interview'],
      required: true,
    },
    inputData: {
      resumeText: String,
      jobDescription: String,
      companyName: String,
      hiringManagerName: String,
      questionCount: Number,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Index for efficient dashboard queries
analysisSchema.index({ userId: 1, type: 1, createdAt: -1 });

export default mongoose.model('Analysis', analysisSchema);
