# 📡 AI Career Copilot — API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <access_token>`

---

## 🔐 Authentication

### POST `/auth/signup`
Register a new user. Sends verification email.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email."
}
```

---

### POST `/auth/verify-email`
Verify email with token from email link.

**Request Body:**
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Response `200`:**
```json
{ "success": true, "message": "Email verified successfully." }
```

---

### POST `/auth/login`
Login with verified email + password.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**Response `200`:**
```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "_id": "665f...",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

### POST `/auth/refresh`
Get new access token using refresh token.

**Request Body:**
```json
{ "refreshToken": "eyJ..." }
```

**Response `200`:**
```json
{ "accessToken": "eyJ..." }
```

---

### POST `/auth/logout`
Invalidate refresh token.

**Request Body:**
```json
{ "refreshToken": "eyJ..." }
```

**Response `200`:**
```json
{ "success": true, "message": "Logged out successfully." }
```

---

### POST `/auth/forgot-password`
Send password reset email.

**Request Body:**
```json
{ "email": "jane@example.com" }
```

---

### POST `/auth/reset-password`
Reset password with token.

**Request Body:**
```json
{
  "token": "eyJ...",
  "password": "NewSecurePass456!"
}
```

---

## 🤖 AI Features (Protected)

### POST `/ai/analyze-resume`
Analyze resume text with Gemini AI.

**Request Body:**
```json
{
  "resumeText": "John Doe\nSoftware Engineer\n5 years experience..."
}
```

**Response `200`:**
```json
{
  "success": true,
  "analysis": {
    "overallScore": 78,
    "strengths": ["Strong technical skills", "Quantified achievements"],
    "weaknesses": ["Missing summary section", "No LinkedIn URL"],
    "suggestions": ["Add a professional summary", "Include certifications"],
    "atsScore": 72,
    "keywordsFound": ["JavaScript", "React", "Node.js"],
    "missingKeywords": ["AWS", "Docker", "CI/CD"],
    "sectionScores": {
      "experience": 85,
      "education": 70,
      "skills": 80,
      "formatting": 65
    }
  }
}
```

---

### POST `/ai/match-jd`
Match resume against a job description.

**Request Body:**
```json
{
  "resumeText": "...",
  "jobDescription": "We are looking for a Senior React Developer..."
}
```

**Response `200`:**
```json
{
  "success": true,
  "match": {
    "matchScore": 84,
    "matchedSkills": ["React", "TypeScript", "REST APIs"],
    "missingSkills": ["GraphQL", "AWS Lambda"],
    "recommendations": ["Highlight your REST API experience more", "Add GraphQL to your skills"],
    "keywordDensity": 76,
    "experienceMatch": true,
    "educationMatch": true,
    "summary": "Strong match! You meet 84% of requirements..."
  }
}
```

---

### POST `/ai/cover-letter`
Generate a tailored cover letter.

**Request Body:**
```json
{
  "resumeText": "...",
  "jobDescription": "...",
  "companyName": "Acme Corp",
  "hiringManagerName": "Sarah Johnson"
}
```

**Response `200`:**
```json
{
  "success": true,
  "coverLetter": "Dear Sarah Johnson,\n\nI am excited to apply for..."
}
```

---

### POST `/ai/interview-prep`
Generate mock interview questions + model answers.

**Request Body:**
```json
{
  "resumeText": "...",
  "jobDescription": "...",
  "questionCount": 10
}
```

**Response `200`:**
```json
{
  "success": true,
  "interview": {
    "questions": [
      {
        "id": 1,
        "category": "Technical",
        "question": "Explain the difference between useEffect and useLayoutEffect in React.",
        "modelAnswer": "useEffect runs asynchronously after paint...",
        "difficulty": "Medium",
        "tips": ["Mention cleanup functions", "Give a real-world example"]
      }
    ],
    "totalQuestions": 10,
    "categories": {
      "Technical": 5,
      "Behavioral": 3,
      "Situational": 2
    }
  }
}
```

---

## 👤 User (Protected)

### GET `/user/profile`
Get current user profile.

**Response `200`:**
```json
{
  "success": true,
  "user": {
    "_id": "665f...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-06-01T10:00:00Z"
  }
}
```

---

### GET `/user/dashboard`
Get dashboard stats + activity history.

**Response `200`:**
```json
{
  "success": true,
  "stats": {
    "totalAnalyses": 12,
    "totalMatches": 8,
    "totalCoverLetters": 5,
    "totalInterviewSessions": 3,
    "avgResumeScore": 76,
    "avgMatchScore": 81
  },
  "recentActivity": [...]
}
```

---

### POST `/user/upload-resume`
Upload a PDF resume for parsing.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `resume` — PDF file (max 5MB)

**Response `200`:**
```json
{
  "success": true,
  "resumeText": "Extracted text from your PDF...",
  "fileName": "john_doe_resume.pdf"
}
```

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

| HTTP Code | Meaning                   |
|-----------|---------------------------|
| 400       | Bad Request / Validation  |
| 401       | Unauthorized              |
| 403       | Forbidden                 |
| 404       | Not Found                 |
| 429       | Rate Limit Exceeded       |
| 500       | Internal Server Error     |
