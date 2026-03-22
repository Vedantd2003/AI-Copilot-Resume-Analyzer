@echo off
echo 🚀 AI Career Copilot - Git Setup Script
echo =====================================
echo.

REM Navigate to project directory
cd /d "C:\Users\Admin\Downloads\ai-career-copilot\ai-career-copilot"
echo 📁 Current directory: %CD%
echo.

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git branch -M main
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)
echo.

REM Add remote repository
echo 🔗 Adding remote repository...
git remote add origin https://github.com/Vedantd2003/AI-Copilot-Resume-Analyzer.git
echo ✅ Remote repository added
echo.

REM Add all files
echo 📋 Adding all files to Git...
git add .
echo ✅ Files added to staging
echo.

REM Show status
echo 📊 Git Status:
git status
echo.

REM Create commit
echo 💾 Creating commit...
git commit -m "🎤 Add AI Voice Interview with 3D Robot

✨ New Features:
- AI Voice Interview with 3D animated robot interviewer
- Virtual interview room with immersive 3D environment
- Recruiter-style conversational questions with voice synthesis
- Hand-waving hello animations and friendly robot design
- Real-time voice feedback and scoring
- Enhanced UI with glassmorphism design
- Docker deployment support

🤖 Robot Features:
- Smooth 3D elements with rounded shapes
- Friendly smile and expressive eyes
- Natural hand-waving animations
- Voice synthesis for question delivery
- Professional indigo/purple color scheme
- Hover effects and smooth transitions

🐳 Docker:
- Multi-stage Docker builds
- Docker Compose configuration
- Production-ready deployment"
echo ✅ Commit created
echo.

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push -u origin main
echo ✅ Pushed to GitHub!
echo.

echo 🎉 Git setup complete!
echo.
echo 🌐 Your repository is now available at:
echo    https://github.com/Vedantd2003/AI-Copilot-Resume-Analyzer
echo.
echo 🐳 To run the application with Docker:
echo    docker-compose up --build
echo.
echo 📊 To check service status:
echo    docker-compose ps
echo.
echo 🛑 To stop services:
echo    docker-compose down
echo.
pause
