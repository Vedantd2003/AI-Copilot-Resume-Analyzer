import { GoogleGenerativeAI } from '@google/generative-ai';
import * as mockService from './mock-ai.service.js';

const getGeminiModel = async () => {
  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️ GEMINI_API_KEY not configured, using mock service');
    throw new Error('USE_MOCK_SERVICE');
  }
  
  try {
    // Try different initialization approaches
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try the most basic model first
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Test with a very simple request
    const testResult = await model.generateContent({
      contents: [{ parts: [{ text: "Hi" }] }]
    });
    
    console.log('✅ Using gemini-1.5-flash model');
    return model;
    
  } catch (error) {
    console.log(`❌ Gemini API Error: ${error.message}`);
    console.log('⚠️ This might be due to:');
    console.log('   - API key not having proper permissions');
    console.log('   - Region restrictions on API key');
    console.log('   - Billing not enabled');
    console.log('   - Model availability in your region');
    console.log('⚠️ Using mock service as fallback');
    throw new Error('USE_MOCK_SERVICE');
  }
};

const safeParseJSON = (text) => {
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
};

// ─────────────────────────────────────────────
// Resume Analysis
// ─────────────────────────────────────────────
export const analyzeResume = async (resumeText) => {
  try {
    const model = await getGeminiModel();

    const prompt = `You are an expert resume coach and ATS (Applicant Tracking System) specialist with 15+ years of experience.

Analyze the following resume and return a detailed JSON analysis.

Resume:
"""
${resumeText}
"""

Return ONLY valid JSON (no markdown, no explanation) in this exact structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "suggestions": [<string>, ...],
  "keywordsFound": [<string>, ...],
  "missingKeywords": [<string>, ...],
  "sectionScores": {
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "skills": <number 0-100>,
    "formatting": <number 0-100>,
    "summary": <number 0-100>
  },
  "impactStatement": "<one sentence overall assessment>",
  "topImprovements": [
    { "priority": "high|medium|low", "action": "<string>", "reason": "<string>" }
  ]
}

Focus on ATS compatibility, keyword optimization, and overall resume effectiveness.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return safeParseJSON(text);
  } catch (error) {
    if (error.message === 'USE_MOCK_SERVICE') {
      console.log('🤖 Using mock resume analysis');
      return mockService.analyzeResume(resumeText);
    }
    throw error;
  }
};

// ─────────────────────────────────────────────
// JD Matching
// ─────────────────────────────────────────────
export const matchJobDescription = async (resumeText, jobDescription) => {
  try {
    const model = await getGeminiModel();

    const prompt = `You are an expert career counselor and hiring manager.

Compare the following resume against the job description and return a detailed compatibility analysis as JSON.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return ONLY valid JSON (no markdown) in this exact structure:
{
  "matchScore": <number 0-100>,
  "keywordDensity": <number 0-100>,
  "experienceMatch": <boolean>,
  "educationMatch": <boolean>,
  "matchedSkills": [<string>, ...],
  "missingSkills": [<string>, ...],
  "matchedRequirements": [<string>, ...],
  "missingRequirements": [<string>, ...],
  "recommendations": [<string>, ...],
  "summary": "<2-3 sentence overall assessment>",
  "salaryRangeEstimate": "<estimated range based on JD>",
  "roleLevel": "entry|mid|senior|lead|executive",
  "quickWins": [<string>, ...]
}

Be specific and actionable in your analysis.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return safeParseJSON(text);
  } catch (error) {
    if (error.message === 'USE_MOCK_SERVICE') {
      console.log('🤖 Using mock job matching');
      return mockService.matchJobDescription(resumeText, jobDescription);
    }
    throw error;
  }
};

// ─────────────────────────────────────────────
// Cover Letter Generation
// ─────────────────────────────────────────────
export const generateCoverLetter = async (resumeText, jobDescription, companyName, hiringManagerName) => {
  try {
    const model = await getGeminiModel();

    const salutation = hiringManagerName
      ? `Dear ${hiringManagerName},`
      : 'Dear Hiring Manager,';

    const prompt = `You are an expert professional writer specializing in career documents.

Generate a compelling, personalized cover letter based on the resume and job description below.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Company: ${companyName || 'the company'}
Salutation: ${salutation}

Requirements:
- Start with the salutation: "${salutation}"
- 3-4 paragraphs, professional but engaging tone
- Highlight specific matching skills and experiences
- Show genuine enthusiasm for the role and company
- End with a confident call to action
- Approximately 300-400 words
- Do NOT include placeholder brackets like [Your Name] - use context from the resume

Return ONLY the cover letter text, no JSON, no explanations.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    if (error.message === 'USE_MOCK_SERVICE') {
      console.log('🤖 Using mock cover letter generation');
      return mockService.generateCoverLetter(resumeText, jobDescription, companyName, hiringManagerName);
    }
    throw error;
  }
};

// ─────────────────────────────────────────────
// Interview Preparation
// ─────────────────────────────────────────────
export const generateInterviewQuestions = async (resumeText, jobDescription, questionCount = 10) => {
  try {
    const model = await getGeminiModel();
    const count = Math.min(Math.max(parseInt(questionCount) || 10, 5), 20);

    const prompt = `You are a senior hiring manager and interview coach.

Generate ${count} tailored interview questions with model answers based on the resume and job description.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return ONLY valid JSON (no markdown) in this exact structure:
{
  "questions": [
    {
      "id": <number>,
      "category": "Technical|Behavioral|Situational|Culture Fit|Leadership",
      "difficulty": "Easy|Medium|Hard",
      "question": "<interview question>",
      "modelAnswer": "<comprehensive model answer, 3-5 sentences>",
      "tips": ["<tip 1>", "<tip 2>"],
      "followUpQuestions": ["<follow-up 1>"]
    }
  ],
  "totalQuestions": ${count},
  "categories": {
    "Technical": <count>,
    "Behavioral": <count>,
    "Situational": <count>,
    "Culture Fit": <count>,
    "Leadership": <count>
  },
  "preparationTips": [<string>, ...],
  "redFlags": [<string describing common mistakes>, ...]
}

Distribute questions across categories. Focus on role-specific technical questions.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return safeParseJSON(text);
  } catch (error) {
    if (error.message === 'USE_MOCK_SERVICE') {
      console.log('🤖 Using mock interview questions');
      return mockService.generateInterviewQuestions(resumeText, jobDescription, questionCount);
    }
    throw error;
  }
};
