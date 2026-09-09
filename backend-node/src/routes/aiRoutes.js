import express from 'express';
import { generateQuestions, getAITasks } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/tasks', protect, getAITasks);
router.post('/generate-questions', protect, generateQuestions);

export default router;
