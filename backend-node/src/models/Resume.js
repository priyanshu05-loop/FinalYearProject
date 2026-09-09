import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    extractedSkills: { type: [String], default: [] },
    extractedExperience: {
      years: { type: Number, default: 0 },
      summary: { type: String, default: '' },
      titles: { type: [String], default: [] },
    },
    extractedEducation: { type: [String], default: [] },
    extractedCertifications: { type: [String], default: [] },
    rawText: { type: String, default: '' },
    parsedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
