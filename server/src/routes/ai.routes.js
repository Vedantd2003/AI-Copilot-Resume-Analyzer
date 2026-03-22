import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.middleware.js';
import {
  analyzeResume, matchJobDescription,
  generateCoverLetter, generateInterviewPrep,
} from '../controllers/ai.controller.js';

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { success: false, error: 'AI request limit reached. Please try again in an hour.' },
});

const resumeTextValidation = body('resumeText')
  .trim().notEmpty().withMessage('Resume text is required')
  .isLength({ min: 50 }).withMessage('Resume text is too short')
  .isLength({ max: 15000 }).withMessage('Resume text exceeds maximum length');

const jdValidation = body('jobDescription')
  .trim().notEmpty().withMessage('Job description is required')
  .isLength({ min: 50 }).withMessage('Job description is too short')
  .isLength({ max: 10000 }).withMessage('Job description exceeds maximum length');

router.use(protect);
router.use(aiLimiter);

router.post('/analyze-resume', [resumeTextValidation], analyzeResume);
router.post('/match-jd', [resumeTextValidation, jdValidation], matchJobDescription);
router.post('/cover-letter', [resumeTextValidation, jdValidation], generateCoverLetter);
router.post('/interview-prep', [resumeTextValidation], generateInterviewPrep);

export default router;
