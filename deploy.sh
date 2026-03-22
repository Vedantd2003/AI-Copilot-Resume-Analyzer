#!/bin/bash

# AI Career Copilot Deployment Script
# This script will push the project to GitHub and trigger Docker build

echo "🚀 Starting AI Career Copilot Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add remote repository
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/Vedantd2003/AI-Copilot-Resume-Analyzer.git

# Add all files to git
echo "📋 Adding files to Git..."
git add .

# Create commit
echo "💾 Creating commit..."
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

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

# Build and run Docker containers
echo "🐳 Building Docker containers..."
docker-compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   MongoDB:  localhost:27017"
echo ""
echo "📊 Check logs with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"
