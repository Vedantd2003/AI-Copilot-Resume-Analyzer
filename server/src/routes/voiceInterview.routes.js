import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.middleware.js';
import {
  generateQuestion, evaluateResponse, getInterviewTips, getVoiceHistory
} from '../controllers/voiceInterview.controller.js';

const router = express.Router();

const voiceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 voice interviews per hour
  message: { success: false, error: 'Voice interview limit reached. Please try again in an hour.' },
});

const questionValidation = [
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('category').optional().isIn(['technical', 'behavioral', 'situational', 'leadership', 'general']).withMessage('Invalid category'),
];

const evaluationValidation = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('audioData').optional().isBase64().withMessage('Audio data must be base64 encoded'),
  body('transcript').optional().isString().withMessage('Transcript must be a string'),
];

// Apply authentication and rate limiting
router.use(protect);
router.use(voiceLimiter);

// Voice interview endpoints
router.post('/generate-question', questionValidation, generateQuestion);
router.post('/evaluate-response', evaluationValidation, evaluateResponse);
router.get('/tips', getInterviewTips);
router.get('/history', getVoiceHistory);

export default router;
