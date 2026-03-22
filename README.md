# 🚀 AI Career Copilot – Smart Resume + Job Assistant

A full-stack AI-powered career assistant built with the MERN stack, featuring resume analysis, job description matching, cover letter generation, **AI Voice Interview with 3D Robot**, and mock interview preparation — all powered by Google Gemini AI.

---

## ✨ Features

- **AI Resume Analyzer** — Get detailed feedback on your resume
- **Job Description Matcher** — Score your resume against any JD with actionable suggestions
- **AI Cover Letter Generator** — Generate tailored cover letters instantly
- **Mock Interview Generator** — AI-generated questions + model answers
- **🎤 AI Voice Interview** — Practice with 3D animated robot interviewer
- **🤖 3D Virtual Interview Room** — Immersive interview experience with voice synthesis
- **🎯 Recruiter-Style Questions** — Natural conversational interview format
- **✨ Hand-Waving Robot Animations** — Friendly AI interviewer with gestures
- **🔊 Voice Synthesis** — Robot speaks questions aloud
- **📊 Real-time Feedback** — Live scoring and animation updates
- **User Dashboard** — Analytics, scores, and history
- **JWT Auth** — Secure signup/login with email verification
- **Dark/Light Mode** — System-aware theme toggle
- **PDF Upload** — Parse and analyze real resume PDFs

---

## 🏗️ Tech Stack

| Layer       | Technology                          |
|-------------|--------------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS, GSAP, Three.js, React Three Fiber |
| Backend     | Node.js, Express 5                  |
| Database    | MongoDB + Mongoose                  |
| AI          | Google Gemini 1.5 Flash             |
| 3D Graphics | Three.js, React Three Fiber         |
| Voice       | Web Speech API                      |
| Auth        | JWT (access + refresh tokens)       |
| Email       | Nodemailer (Gmail / SMTP)           |
| Container   | Docker + Docker Compose             |

---

## 📁 Project Structure

```
ai-career-copilot/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── context/         # React context (auth, theme)
│   │   └── utils/           # Helpers
│   ├── Dockerfile
│   └── .env.example
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # Express routers
│   │   ├── middleware/      # Auth, rate limit, upload
│   │   ├── models/          # Mongoose schemas
│   │   ├── services/        # AI + email services
│   │   ├── utils/           # Token, mail helpers
│   │   └── config/          # DB, env config
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── docs/
    └── API.md
```

---

## ⚡ Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose installed
- Google Gemini API key ([get one here](https://makersuite.google.com/app/apikey))
- Gmail account (for email verification)

### 1. Clone & Configure

```bash
git clone https://github.com/your-username/ai-career-copilot.git
cd ai-career-copilot
```

### 2. Set up environment variables

```bash
# Backend
cp server/.env.example server/.env
# Edit server/.env with your values

# Frontend
cp client/.env.example client/.env
# Edit client/.env with your values
```

### 3. Launch with Docker Compose

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

---

## 🌐 Deployment Options

### 🐳 Docker (Local)
```bash
docker-compose up --build
```

### ☁️ Render.com (Production)
See [`RENDER_DEPLOYMENT.md`](./RENDER_DEPLOYMENT.md) for complete deployment guide.

**Quick Start:**
1. Push to GitHub
2. Connect repository to Render
3. Deploy with `render.yaml` configuration
4. Set environment variables in Render dashboard

### 📦 Manual Setup
See manual setup instructions in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable               | Description                          | Required |
|------------------------|--------------------------------------|----------|
| `PORT`                 | Server port (default: 5000)          | ✅       |
| `MONGODB_URI`          | MongoDB connection string            | ✅       |
| `JWT_ACCESS_SECRET`    | JWT access token secret              | ✅       |
| `JWT_REFRESH_SECRET`   | JWT refresh token secret             | ✅       |
| `GEMINI_API_KEY`       | Google Gemini API key                | ✅       |
| `EMAIL_USER`           | Gmail address for sending emails     | ✅       |
| `EMAIL_PASS`           | Gmail app password                   | ✅       |
| `CLIENT_URL`           | Frontend URL (for CORS + emails)     | ✅       |
| `NODE_ENV`             | `development` or `production`        | ✅       |

### Client (`client/.env`)

| Variable              | Description               | Required |
|-----------------------|---------------------------|----------|
| `VITE_API_URL`        | Backend API base URL      | ✅       |

---

## 📧 Email Setup (Gmail)

1. Enable 2-Step Verification on your Google account
2. Go to **Google Account → Security → App Passwords**
3. Generate a new app password for "Mail"
4. Use that 16-character password as `EMAIL_PASS`

---

## 🧪 API Overview

See [`docs/API.md`](./docs/API.md) for full API documentation.

### Key Endpoints

```
POST /api/auth/signup          Register + send verification email
POST /api/auth/login           Login → access + refresh tokens
POST /api/auth/refresh         Refresh access token
POST /api/auth/verify-email    Verify email with token

POST /api/ai/analyze-resume    AI resume analysis
POST /api/ai/match-jd          Resume ↔ JD matching
POST /api/ai/cover-letter      Generate cover letter
POST /api/ai/interview-prep    Generate interview Q&A

POST /api/voice-interview/generate-question  Generate recruiter-style question
POST /api/voice-interview/evaluate-response  Evaluate voice response
GET  /api/voice-interview/tips               Get interview tips
GET  /api/voice-interview/history            Get voice interview history

GET  /api/user/dashboard       Dashboard stats + history
POST /api/user/upload-resume   Upload PDF resume
```

---

## 🐳 Docker Details

### Services

| Service    | Port  | Description              |
|------------|-------|--------------------------|
| `client`   | 5173  | React frontend (Vite)    |
| `server`   | 5000  | Express API              |
| `mongodb`  | 27017 | MongoDB database         |

### Commands

```bash
# Start all services
docker-compose up

# Rebuild after changes
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f server

# Reset database volume
docker-compose down -v
```

---

## 🔒 Security Features

- **Helmet** — HTTP security headers
- **Rate Limiting** — 100 req/15min per IP (stricter on auth routes)
- **CORS** — Configured for frontend origin only
- **bcrypt** — Password hashing (12 rounds)
- **JWT** — Short-lived access tokens (15m) + refresh tokens (7d)
- **Email Verification** — Required before login
- **Input Validation** — Express-validator on all routes

---

## 📄 License

MIT © 2024 AI Career Copilot
