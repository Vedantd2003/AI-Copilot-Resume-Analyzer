import pdfParse from 'pdf-parse';
import fs from 'fs';
import Analysis from '../models/analysis.model.js';
import User from '../models/user.model.js';

// ── Get Profile ──────────────────────────────
export const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
};

// ── Update Profile ───────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Name must be at least 2 characters.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── Dashboard Stats ──────────────────────────
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalAnalyses, totalMatches, totalCoverLetters, totalInterviews, analyses] =
      await Promise.all([
        Analysis.countDocuments({ userId, type: 'resume_analysis' }),
        Analysis.countDocuments({ userId, type: 'jd_match' }),
        Analysis.countDocuments({ userId, type: 'cover_letter' }),
        Analysis.countDocuments({ userId, type: 'interview_prep' }),
        Analysis.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
      ]);

    const resumeAnalyses = analyses.filter((a) => a.type === 'resume_analysis' && a.score != null);
    const jdMatches = analyses.filter((a) => a.type === 'jd_match' && a.score != null);

    const avgResumeScore =
      resumeAnalyses.length > 0
        ? Math.round(resumeAnalyses.reduce((sum, a) => sum + a.score, 0) / resumeAnalyses.length)
        : 0;

    const avgMatchScore =
      jdMatches.length > 0
        ? Math.round(jdMatches.reduce((sum, a) => sum + a.score, 0) / jdMatches.length)
        : 0;

    // Score trend for chart (last 10 resume analyses)
    const scoreTrend = resumeAnalyses.slice(0, 10).reverse().map((a, i) => ({
      label: `Analysis ${i + 1}`,
      score: a.score,
      date: a.createdAt,
    }));

    // Match score trend
    const matchTrend = jdMatches.slice(0, 10).reverse().map((a, i) => ({
      label: `Match ${i + 1}`,
      score: a.score,
      date: a.createdAt,
    }));

    const recentActivity = analyses.slice(0, 10).map((a) => ({
      _id: a._id,
      type: a.type,
      score: a.score,
      companyName: a.inputData?.companyName,
      createdAt: a.createdAt,
    }));

    res.json({
      success: true,
      stats: {
        totalAnalyses,
        totalMatches,
        totalCoverLetters,
        totalInterviews,
        avgResumeScore,
        avgMatchScore,
        totalActivities: totalAnalyses + totalMatches + totalCoverLetters + totalInterviews,
      },
      scoreTrend,
      matchTrend,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
};

// ── Upload & Parse Resume PDF ────────────────
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(fileBuffer);

    // Clean up uploaded file after parsing
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete temp file:', err.message);
    });

    const resumeText = data.text.replace(/\s+/g, ' ').trim();

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract text from this PDF. Please ensure it is a text-based PDF (not scanned).',
      });
    }

    res.json({
      success: true,
      resumeText,
      fileName: req.file.originalname,
      wordCount: resumeText.split(' ').length,
    });
  } catch (err) {
    // Clean up on error
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
    next(err);
  }
};

// ── Get Analysis History ─────────────────────
export const getHistory = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user._id };
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [analyses, total] = await Promise.all([
      Analysis.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Analysis.countDocuments(query),
    ]);

    res.json({
      success: true,
      analyses,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};
