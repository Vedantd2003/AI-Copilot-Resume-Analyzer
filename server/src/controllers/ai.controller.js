import { validationResult } from 'express-validator';
import * as geminiService from '../services/gemini.service.js';
import Analysis from '../models/analysis.model.js';

// ── Analyze Resume ───────────────────────────
export const analyzeResume = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { resumeText } = req.body;
    const analysis = await geminiService.analyzeResume(resumeText);

    // Save to history
    await Analysis.create({
      userId: req.user._id,
      type: 'resume_analysis',
      inputData: { resumeText: resumeText.substring(0, 500) }, // Store truncated version
      result: analysis,
      score: analysis.overallScore,
    });

    res.json({ success: true, analysis });
  } catch (err) {
    if (err.message?.includes('GEMINI_API_KEY')) {
      return res.status(503).json({ success: false, error: 'AI service is not configured.' });
    }
    next(err);
  }
};

// ── Match JD ─────────────────────────────────
export const matchJobDescription = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { resumeText, jobDescription } = req.body;
    const match = await geminiService.matchJobDescription(resumeText, jobDescription);

    await Analysis.create({
      userId: req.user._id,
      type: 'jd_match',
      inputData: {
        resumeText: resumeText.substring(0, 500),
        jobDescription: jobDescription.substring(0, 500),
      },
      result: match,
      score: match.matchScore,
    });

    res.json({ success: true, match });
  } catch (err) {
    next(err);
  }
};

// ── Generate Cover Letter ────────────────────
export const generateCoverLetter = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { resumeText, jobDescription, companyName, hiringManagerName } = req.body;
    const coverLetter = await geminiService.generateCoverLetter(
      resumeText, jobDescription, companyName, hiringManagerName
    );

    await Analysis.create({
      userId: req.user._id,
      type: 'cover_letter',
      inputData: { resumeText: resumeText.substring(0, 500), companyName, hiringManagerName },
      result: { coverLetter },
    });

    res.json({ success: true, coverLetter });
  } catch (err) {
    next(err);
  }
};

// ── Interview Prep ───────────────────────────
export const generateInterviewPrep = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { resumeText, jobDescription, questionCount } = req.body;
    const interview = await geminiService.generateInterviewQuestions(
      resumeText, jobDescription, questionCount
    );

    await Analysis.create({
      userId: req.user._id,
      type: 'interview_prep',
      inputData: { resumeText: resumeText.substring(0, 500), questionCount },
      result: interview,
    });

    res.json({ success: true, interview });
  } catch (err) {
    next(err);
  }
};
