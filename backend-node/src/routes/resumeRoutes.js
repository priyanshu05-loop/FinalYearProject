import express from 'express';
import { createResume, getResume, extractText, upload } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), createResume);
router.get('/', protect, getResume);
router.post('/extract-text', protect, upload.single('file'), extractText);

export default router;
