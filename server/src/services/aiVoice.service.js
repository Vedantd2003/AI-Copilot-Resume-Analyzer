import * as geminiService from './gemini.service.js';
import * as mockService from './mock-ai.service.js';

// Speech-to-text using Web Speech API simulation
// In production, you'd use Google Cloud Speech-to-Text or similar
const transcribeAudio = async (audioBuffer) => {
  // For now, we'll simulate transcription
  // In production, integrate with actual speech-to-text service
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("I believe my strongest technical skills are in JavaScript and React development. I've been working with these technologies for over three years and have built several production applications. I'm particularly proud of a recent project where I optimized a React application's performance by implementing code splitting and lazy loading, which reduced the initial bundle size by 40% and significantly improved the user experience.");
    }, 1000);
  });
};

// Mock speech analysis for fallback
const mockVoiceAnalysis = (transcript) => {
  return {
    overallScore: 78,
    confidence: 82,
    tone: 75,
    fluency: 80,
    clarity: 76,
    speakingPace: 74,
    duration: 45,
    wordCount: 58,
    wordsPerMinute: 77,
    feedback: {
      strengths: [
        "Clear articulation and good vocabulary usage",
        "Confident tone throughout the response",
        "Well-structured answer with logical flow",
        "Appropriate speaking pace for interview context"
      ],
      improvements: [
        "Try to reduce filler words (um, uh) for better fluency",
        "Consider varying your tone to emphasize key points",
        "Practice more concise responses for better time management",
        "Work on maintaining consistent energy throughout"
      ],
      specificTips: [
        "Use the STAR method (Situation, Task, Action, Result) for behavioral questions",
        "Practice speaking at 120-150 words per minute for optimal clarity",
        "Record yourself practicing to identify areas for improvement",
        "Take brief pauses to gather thoughts rather than using filler words"
      ]
    },
    transcript: transcript,
    recommendations: [
      "Focus on reducing filler words to improve fluency score",
      "Practice speaking with more varied intonation",
      "Work on maintaining consistent pace throughout responses"
    ]
  };
};

// Voice synthesis for recruiter questions (using Web Speech API simulation)
const synthesizeSpeech = async (text) => {
  // For now, return the text for frontend TTS
  // In production, you could use Google Cloud Text-to-Speech
  return {
    text,
    audioUrl: null, // Frontend will handle TTS
    duration: text.length * 0.1 // Rough estimate in seconds
  };
};

// Generate recruiter-style interview questions with voice
export const generateRecruiterQuestion = async (difficulty = 'medium', category = 'behavioral') => {
  try {
    const model = await geminiService.getGeminiModel();
    
    const prompt = `You are an experienced technical recruiter conducting a live interview. Generate a natural, conversational interview question that a real recruiter would ask.

Difficulty level: ${difficulty}
Category: ${category}
Interview type: Live voice conversation

Return ONLY valid JSON in this exact format:
{
  "question": "<natural, conversational question as a recruiter would say it>",
  "category": "Technical|Behavioral|Situational|Leadership|Cultural Fit",
  "difficulty": "Easy|Medium|Hard",
  "followUp": "<potential follow-up question>",
  "recruiterPersona": "friendly|professional|casual|formal",
  "expectedDuration": <number in seconds>,
  "keyPoints": ["<what recruiter is looking for 1>", "<what recruiter is looking for 2>"],
  "voiceTone": "conversational|encouraging|professional|friendly",
  "greeting": "<brief greeting like 'Great question!' or 'Let me ask you...'>"
}

Make it sound like a real human recruiter speaking naturally, not robotic. Use conversational language.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questionData = JSON.parse(cleaned);
    
    // Add voice synthesis
    const voiceData = await synthesizeSpeech(questionData.greeting + ' ' + questionData.question);
    
    return {
      ...questionData,
      voiceData,
      fullText: questionData.greeting + ' ' + questionData.question
    };
  } catch (error) {
    console.log('🤖 Using mock recruiter question');
    const mockQuestion = {
      question: "Tell me about a time when you had to work with a difficult team member. How did you handle that situation?",
      category: "Behavioral",
      difficulty: "Medium",
      followUp: "What was the final outcome of that situation?",
      recruiterPersona: "professional",
      expectedDuration: 45,
      keyPoints: [
        "Conflict resolution skills",
        "Team collaboration ability",
        "Professional communication"
      ],
      voiceTone: "conversational",
      greeting: "Great! Let me ask you this..."
    };
    
    const voiceData = await synthesizeSpeech(mockQuestion.greeting + ' ' + mockQuestion.question);
    
    return {
      ...mockQuestion,
      voiceData,
      fullText: mockQuestion.greeting + ' ' + mockQuestion.question
    };
  }
};

// Evaluate voice interview response
export const evaluateVoiceResponse = async (audioData, question, originalTranscript = null) => {
  try {
    // Step 1: Transcribe audio
    const transcript = originalTranscript || await transcribeAudio(audioData);
    
    // Step 2: Get AI evaluation
    const model = await geminiService.getGeminiModel();
    
    const prompt = `You are an expert interview coach and communication specialist.

Evaluate this voice interview response and provide detailed feedback.

Interview Question: "${question}"
Transcript: "${transcript}"

Return ONLY valid JSON in this exact format:
{
  "overallScore": <number 0-100>,
  "confidence": <number 0-100>,
  "tone": <number 0-100>,
  "fluency": <number 0-100>,
  "clarity": <number 0-100>,
  "speakingPace": <number 0-100>,
  "duration": <estimated seconds>,
  "wordCount": <number>,
  "wordsPerMinute": <number>,
  "feedback": {
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
    "specificTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
  },
  "transcript": "${transcript}",
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
}

Focus on:
- Communication clarity and confidence
- Speaking pace and fluency
- Content relevance and structure
- Tone and professionalism
- Areas for improvement

Be encouraging but constructive in your feedback.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
    
  } catch (error) {
    console.log('🤖 Using mock voice evaluation');
    // Use mock transcription if we don't have one
    const transcript = originalTranscript || "I believe my strongest technical skills are in JavaScript and React development. I've been working with these technologies for over three years and have built several production applications. I'm particularly proud of a recent project where I optimized a React application's performance by implementing code splitting and lazy loading, which reduced the initial bundle size by 40% and significantly improved the user experience.";
    
    return mockVoiceAnalysis(transcript);
  }
};

// Get voice interview tips and preparation
export const getVoiceInterviewTips = async () => {
  try {
    const model = await geminiService.getGeminiModel();
    
    const prompt = `Provide comprehensive tips for voice interview preparation.

Return ONLY valid JSON in this exact format:
{
  "preparationTips": [
    {
      "category": "Technical Preparation",
      "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
    },
    {
      "category": "Voice & Speaking",
      "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
    },
    {
      "category": "Environment Setup",
      "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
    }
  ],
  "commonMistakes": ["<mistake 1>", "<mistake 2>", "<mistake 3>"],
  "bestPractices": ["<practice 1>", "<practice 2>", "<practice 3>"],
  "technicalRequirements": ["<requirement 1>", "<requirement 2>", "<requirement 3>"]
}

Focus on practical, actionable advice for voice interviews.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.log('🤖 Using mock voice interview tips');
    return {
      preparationTips: [
        {
          category: "Technical Preparation",
          tips: [
            "Research the company and role thoroughly",
            "Prepare 3-5 key talking points about your experience",
            "Practice common interview questions aloud"
          ]
        },
        {
          category: "Voice & Speaking",
          tips: [
            "Speak at a moderate pace (120-150 words per minute)",
            "Use clear, concise language",
            "Vary your tone to maintain engagement"
          ]
        },
        {
          category: "Environment Setup",
          tips: [
            "Choose a quiet, well-lit space",
            "Test your microphone beforehand",
            "Ensure stable internet connection"
          ]
        }
      ],
      commonMistakes: [
        "Speaking too quickly due to nervousness",
        "Using too many filler words (um, uh, like)",
        "Not answering the specific question asked"
      ],
      bestPractices: [
        "Take a brief moment to think before speaking",
        "Use the STAR method for behavioral questions",
        "Maintain confident, professional tone throughout"
      ],
      technicalRequirements: [
        "Chrome or Firefox browser for best audio support",
        "Microphone permission enabled",
        "Stable internet connection for real-time processing"
      ]
    };
  }
};
