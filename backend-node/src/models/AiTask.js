import mongoose from 'mongoose';

const aiTaskSchema = new mongoose.Schema(
  {
    taskType: { type: String, enum: ['resume_parse', 'question_gen', 'answer_eval', 'speech_analysis', 'face_analysis'], required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    contentType: { type: String, required: true },
    objectId: { type: mongoose.Schema.Types.ObjectId, required: true },
    inputData: { type: Object, default: {} },
    outputData: { type: Object, default: {} },
    errorMessage: { type: String, default: '' },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('AiTask', aiTaskSchema);
