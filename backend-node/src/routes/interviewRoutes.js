import express from 'express';
import {
  listJobRoles,
  createSession,
  listSessions,
  getSession,
  startSession,
  completeSession,
  listQuestions,
  submitAnswer,
  getSessionReport,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/job-roles', protect, listJobRoles);
router.post('/sessions', protect, createSession);
router.get('/sessions', protect, listSessions);
router.get('/sessions/:id', protect, getSession);
router.post('/sessions/:id/start', protect, startSession);
router.post('/sessions/:id/complete', protect, completeSession);
router.get('/questions', protect, listQuestions);
router.post('/answers', protect, submitAnswer);
router.post('/questions/:questionId/submit', protect, submitAnswer);
router.post('/questions/:questionId/submit/', protect, submitAnswer);
router.get('/sessions/:id/report', protect, getSessionReport);
router.get('/sessions/:id/report/', protect, getSessionReport);

export default router;
