import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true },
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['technical', 'behavioral', 'scenario'], required: true },
    expectedAnswerPoints: { type: [String], default: [] },
    orderIndex: { type: Number, required: true },
    timeLimitSeconds: { type: Number, default: 180 },
  },
  { timestamps: true }
);

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true, unique: true },
    videoUrl: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    transcribedText: { type: String, default: '' },
    status: { type: String, enum: ['recording', 'submitted', 'processing', 'evaluated', 'skipped'], default: 'recording' },
    durationSeconds: { type: Number, default: 0 },
    submittedAt: { type: Date },
    evaluatedAt: { type: Date },
  },
  { timestamps: true }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobRole: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole', default: null },
    status: { type: String, enum: ['draft', 'in_progress', 'completed', 'paused'], default: 'draft' },
    startedAt: { type: Date },
    completedAt: { type: Date },
    durationMinutes: { type: Number, default: 0 },
    overallScore: { type: Number, default: null },
    sessionMetadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

const jobRoleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    preferredSkills: { type: [String], default: [] },
    experienceLevel: { type: String, enum: ['entry', 'mid', 'senior'], default: 'mid' },
    difficultyScore: { type: Number, default: 5 },
  },
  { timestamps: true }
);

const speechAnalysisSchema = new mongoose.Schema(
  {
    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true, unique: true },
    fluencyScore: { type: Number, required: true },
    confidenceScore: { type: Number, required: true },
    paceWpm: { type: Number, required: true },
    fillerWordCount: { type: Number, required: true },
    pronunciationScore: { type: Number, required: true },
    analysisData: { type: Object, default: {} },
  },
  { timestamps: true }
);

const faceAnalysisSchema = new mongoose.Schema(
  {
    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true, unique: true },
    confidenceScore: { type: Number, required: true },
    eyeContactPercentage: { type: Number, required: true },
    emotionSummary: { type: Object, default: {} },
    analysisData: { type: Object, default: {} },
  },
  { timestamps: true }
);

const nlpEvaluationSchema = new mongoose.Schema(
  {
    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true, unique: true },
    relevanceScore: { type: Number, required: true },
    contentQualityScore: { type: Number, required: true },
    semanticSimilarityScore: { type: Number, required: true },
    keywordMatch: { type: Object, default: {} },
    feedback: { type: String, default: '' },
    analysisData: { type: Object, default: {} },
  },
  { timestamps: true }
);

const sessionReportSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true, unique: true },
    overallScore: { type: Number, required: true },
    scoreBreakdown: { type: Object, default: {} },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    reportPdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const JobRole = mongoose.model('JobRole', jobRoleSchema);
export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export const Question = mongoose.model('Question', questionSchema);
export const Answer = mongoose.model('Answer', answerSchema);
export const SpeechAnalysis = mongoose.model('SpeechAnalysis', speechAnalysisSchema);
export const FaceAnalysis = mongoose.model('FaceAnalysis', faceAnalysisSchema);
export const NLPEvaluation = mongoose.model('NLPEvaluation', nlpEvaluationSchema);
export const SessionReport = mongoose.model('SessionReport', sessionReportSchema);
