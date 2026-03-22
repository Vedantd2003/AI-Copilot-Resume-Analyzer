// Mock AI Service - Fallback for when Gemini API is not working
// This provides realistic sample responses for testing

export const analyzeResume = async (resumeText) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    overallScore: 75,
    atsScore: 80,
    strengths: [
      "Strong technical skills in JavaScript and React",
      "Good experience with modern development tools",
      "Clear project descriptions with measurable outcomes",
      "Professional education background"
    ],
    weaknesses: [
      "Resume could be more concise - consider reducing to 1-2 pages",
      "Missing specific metrics and quantifiable achievements",
      "Limited information about soft skills and teamwork",
      "Could benefit from more industry-specific keywords"
    ],
    suggestions: [
      "Add specific metrics to your achievements (e.g., 'Increased performance by 30%')",
      "Include more technical keywords relevant to your target roles",
      "Quantify your impact on previous projects",
      "Add a professional summary at the top of your resume"
    ],
    keywordsFound: ["JavaScript", "React", "Node.js", "MongoDB", "Git", "API"],
    missingKeywords: ["Agile", "Scrum", "CI/CD", "Docker", "AWS", "TypeScript"],
    sectionScores: {
      experience: 70,
      education: 85,
      skills: 80,
      formatting: 75,
      summary: 65
    },
    impactStatement: "Your resume shows good technical foundation but needs more quantifiable achievements to stand out.",
    topImprovements: [
      { "priority": "high", "action": "Add metrics to achievements", "reason": "Quantifiable results demonstrate impact" },
      { "priority": "medium", "action": "Include more technical keywords", "reason": "Better ATS optimization" },
      { "priority": "low", "action": "Add professional summary", "reason": "Quick overview for recruiters" }
    ]
  };
};

export const matchJobDescription = async (resumeText, jobDescription) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    overallMatch: 72,
    skillMatch: 78,
    experienceMatch: 68,
    educationMatch: 85,
    matchedSkills: ["JavaScript", "React", "Node.js", "MongoDB", "Git"],
    missingSkills: ["Docker", "AWS", "TypeScript", "GraphQL"],
    strengths: [
      "Strong alignment in core technical skills",
      "Relevant experience with similar technologies",
      "Good educational background for the role"
    ],
    gaps: [
      "Missing cloud experience (AWS/Azure)",
      "No containerization experience (Docker/Kubernetes)",
      "Limited experience with TypeScript"
    ],
    recommendations: [
      "Highlight your JavaScript and React experience more prominently",
      "Consider taking an AWS certification course",
      "Add a TypeScript project to your portfolio",
      "Emphasize your problem-solving abilities"
    ],
    fitScore: 75,
    interviewProbability: "High"
  };
};

export const generateCoverLetter = async (resumeText, jobDescription, companyName, hiringManagerName) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const salutation = hiringManagerName 
    ? `Dear ${hiringManagerName},`
    : 'Dear Hiring Manager,';
  
  return `${salutation}

I am excited to apply for the Software Developer position at ${companyName}. With my strong background in JavaScript, React, and Node.js development, I am confident that I have the skills and experience to contribute significantly to your team.

Throughout my career, I have developed a deep expertise in building scalable web applications using modern JavaScript frameworks. My experience with React has allowed me to create intuitive user interfaces that enhance user experience and drive business results. I have also worked extensively with Node.js to develop robust backend services and APIs.

What particularly draws me to ${companyName} is your commitment to innovation and your focus on creating cutting-edge solutions. I am eager to bring my technical skills and passion for development to a team that shares my values and vision.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm would be an excellent fit for your team. Thank you for considering my application.

Sincerely,
[Your Name]`;
};

export const generateInterviewQuestions = async (resumeText, jobDescription, questionCount = 10) => {
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  return {
    questions: [
      {
        id: 1,
        category: "Technical",
        difficulty: "Medium",
        question: "Can you explain the difference between React hooks and class components?",
        modelAnswer: "React hooks are functions that let you use state and other React features in functional components. They provide a more direct API to React concepts and eliminate the need for class components in most cases. Hooks like useState and useEffect allow you to manage state and side effects in functional components, making code more readable and easier to test.",
        tips: ["Mention specific hooks you've used", "Explain benefits over class components"],
        followUpQuestions: ["What are the rules of hooks?", "How do you optimize performance with hooks?"]
      },
      {
        id: 2,
        category: "Behavioral",
        difficulty: "Easy",
        question: "Tell me about a challenging project you worked on recently.",
        modelAnswer: "I recently worked on a complex e-commerce platform where we had to implement real-time inventory management. The challenge was ensuring data consistency across multiple services while maintaining high performance. I implemented a solution using event-driven architecture and caching strategies, which reduced inventory sync time by 40% and improved overall system reliability.",
        tips: ["Focus on your specific role and contribution", "Highlight problem-solving skills"],
        followUpQuestions: ["What was the biggest obstacle you faced?", "How did you measure success?"]
      },
      {
        id: 3,
        category: "Situational",
        difficulty: "Medium",
        question: "How would you handle a situation where you disagree with a technical decision made by your team lead?",
        modelAnswer: "I would first seek to understand the reasoning behind the decision by asking clarifying questions. Then I would present my concerns with supporting evidence or data, suggesting alternative approaches if applicable. I believe in respectful dialogue and would be open to being proven wrong, as the goal is to find the best solution for the project rather than to be right.",
        tips: ["Show respect for authority", "Demonstrate problem-solving approach"],
        followUpQuestions: ["What if the decision was clearly wrong?", "How do you handle conflicts in general?"]
      }
    ],
    totalQuestions: 10,
    categories: {
      Technical: 4,
      Behavioral: 3,
      Situational: 2,
      CultureFit: 1
    },
    preparationTips: [
      "Research the company's tech stack and recent projects",
      "Prepare specific examples from your experience",
      "Practice explaining technical concepts clearly",
      "Think about questions you want to ask them"
    ],
    redFlags: [
      "Avoid speaking negatively about previous employers",
      "Don't exaggerate your technical skills",
      "Always be honest about what you don't know",
      "Avoid giving one-word answers"
    ]
  };
};
