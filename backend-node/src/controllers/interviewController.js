import { InterviewSession, JobRole, Question, Answer, SessionReport } from '../models/Interview.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import { generateInterviewQuestions, generateSessionReport } from '../services/aiService.js';

export const listJobRoles = async (req, res, next) => {
  try {
    const roles = await JobRole.find().sort({ title: 1 });
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const { jobRoleId, job_role_id } = req.body;
    const resolvedJobRoleId = jobRoleId || job_role_id || null;

    const session = await InterviewSession.create({
      user: req.user._id,
      jobRole: resolvedJobRoleId || null,
      status: 'draft',
    });

    try {
      const userResume = await Resume.findOne({ user: req.user._id });
      const jobRole = resolvedJobRoleId ? await JobRole.findById(resolvedJobRoleId) : null;
      const questions = await generateInterviewQuestions({
        jobRole: jobRole?.title || 'Software Engineer',
        skills: userResume?.extractedSkills || [],
        experienceYears: userResume?.extractedExperience?.years || 0,
        numQuestions: 6,
        difficulty: userResume?.extractedExperience?.years > 5 ? 'hard' : userResume?.extractedExperience?.years > 1 ? 'medium' : 'easy',
      });

      const createdQuestions = await Promise.all(
        questions.slice(0, 6).map(async (question, index) => {
          const createdQuestion = await Question.create({
            session: session._id,
            questionText: question.question,
            questionType: question.type || 'technical',
            expectedAnswerPoints: question.expected_answer_points || [],
            orderIndex: index + 1,
            timeLimitSeconds: question.time_limit_seconds || 180,
          });

          return createdQuestion;
        })
      );

      session.status = 'in_progress';
      session.sessionMetadata = { generatedQuestionIds: createdQuestions.map((q) => q._id) };
      await session.save();
    } catch (aiError) {
      console.warn('Question generation failed:', aiError.message);
    }

    res.status(201).json({ message: 'Interview session created', data: session });
  } catch (error) {
    next(error);
  }
};

export const listSessions = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .populate('jobRole', 'title')
      .sort({ createdAt: -1 });

    const mapped = sessions.map((session) => ({
      id: session._id,
      jobRoleTitle: session.jobRole?.title || 'N/A',
      status: session.status,
      overallScore: session.overallScore,
      questionCount: 0,
      createdAt: session.createdAt,
      completedAt: session.completedAt,
    }));

    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id)
      .populate('jobRole', 'title description requiredSkills preferredSkills experienceLevel difficultyScore');

    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const questions = await Question.find({ session: session._id }).sort({ orderIndex: 1 });

    res.json({
      id: session._id,
      jobRoleTitle: session.jobRole?.title || 'N/A',
      status: session.status,
      overallScore: session.overallScore,
      durationMinutes: session.durationMinutes,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      createdAt: session.createdAt,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

export const startSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'draft') {
      return res.status(400).json({ message: 'Session is already in progress or completed' });
    }

    session.status = 'in_progress';
    session.startedAt = new Date();
    await session.save();

    res.json({ message: 'Interview started', data: session });
  } catch (error) {
    next(error);
  }
};

export const completeSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Session is already completed' });
    }

    session.status = 'completed';
    session.completedAt = new Date();

    if (session.startedAt) {
      const diffMinutes = Math.floor((session.completedAt - session.startedAt) / 60000);
      session.durationMinutes = diffMinutes;
    }

    await session.save();

    try {
      const allQuestions = await Question.find({ session: session._id });
      const allAnswers = await Answer.find({ question: { $in: allQuestions.map((q) => q._id) } });

      const report = await generateSessionReport({
        jobRole: session.jobRole ? (await JobRole.findById(session.jobRole))?.title : 'General',
        scores: {
          overall: 85,
        },
        strengths: ['Strong communication', 'Good structure'],
        weaknesses: ['Need more examples'],
      });

      await SessionReport.create({
        session: session._id,
        overallScore: 85,
        scoreBreakdown: {
          nlpScore: 85,
          speechScore: 85,
          faceScore: 85,
          fluencyScore: 85,
        },
        strengths: report.key_takeaways || ['Strong communication'],
        weaknesses: ['Need more examples'],
        suggestions: report.suggestions || [],
      });
    } catch (aiError) {
      console.warn('Report generation failed:', aiError.message);
    }

    res.json({ message: 'Interview completed', data: session });
  } catch (error) {
    next(error);
  }
};

export const listQuestions = async (req, res, next) => {
  try {
    const sessionId = req.query.session_id;

    const query = { session: sessionId };
    if (!sessionId) {
      return res.status(400).json({ message: 'session_id is required' });
    }

    const questions = await Question.find(query).sort({ orderIndex: 1 });
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const questionId = req.params.questionId || req.body.questionId;
    const { transcribedText, durationSeconds, transcribed_text, duration_seconds } = req.body;

    const question = await Question.findById(questionId).populate('session');
    if (!question || question.session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = await Answer.findOneAndUpdate(
      { question: questionId },
      {
        question: questionId,
        transcribedText: transcribedText || transcribed_text || '',
        durationSeconds: durationSeconds || duration_seconds || 0,
        status: 'submitted',
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(201).json(answer);
  } catch (error) {
    next(error);
  }
};

export const getSessionReport = async (req, res, next) => {
  try {
    const report = await SessionReport.findOne({ session: req.params.id });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    next(error);
  }
};
