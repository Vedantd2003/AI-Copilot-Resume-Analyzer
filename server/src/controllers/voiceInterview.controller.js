import { validationResult } from 'express-validator';
import * as aiVoiceService from '../services/aiVoice.service.js';
import Analysis from '../models/analysis.model.js';

// ── Generate Recruiter Interview Question ────────────────────────
export const generateQuestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { difficulty = 'medium', category = 'behavioral' } = req.body;
    const question = await aiVoiceService.generateRecruiterQuestion(difficulty, category);

    res.json({ 
      success: true, 
      question 
    });
  } catch (err) {
    next(err);
  }
};

// ── Evaluate Voice Response ────────────────────────────
export const evaluateResponse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { audioData, question, transcript } = req.body;
    const evaluation = await aiVoiceService.evaluateVoiceResponse(audioData, question, transcript);

    // Save to history
    await Analysis.create({
      userId: req.user._id,
      type: 'voice_interview',
      inputData: { 
        question: question.substring(0, 200),
        transcript: transcript?.substring(0, 500) || 'Auto-transcribed'
      },
      result: evaluation,
      score: evaluation.overallScore,
    });

    res.json({ 
      success: true, 
      evaluation 
    });
  } catch (err) {
    next(err);
  }
};

// ── Get Interview Tips ──────────────────────────────────
export const getInterviewTips = async (req, res, next) => {
  try {
    const tips = await aiVoiceService.getVoiceInterviewTips();

    res.json({ 
      success: true, 
      tips 
    });
  } catch (err) {
    next(err);
  }
};

// ── Get Voice Interview History ────────────────────────
export const getVoiceHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const analyses = await Analysis.find({ 
      userId: req.user._id, 
      type: 'voice_interview' 
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('inputData.result score createdAt');

    const total = await Analysis.countDocuments({ 
      userId: req.user._id, 
      type: 'voice_interview' 
    });

    res.json({
      success: true,
      analyses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};
