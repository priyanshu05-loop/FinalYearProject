import express from 'express';
import { registerUser, loginUser, getCurrentUser, updateProfile, changePassword, logoutUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
