import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { uploadResume as uploadMiddleware } from '../middleware/upload.middleware.js';
import {
  getProfile, updateProfile, getDashboard,
  uploadResume, getHistory,
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);
router.get('/history', getHistory);
router.post('/upload-resume', (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, error: err.message });
    next();
  });
}, uploadResume);

export default router;
