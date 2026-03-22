# 🚀 Deployment Guide

## 📋 Prerequisites

- [Git installed](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [GitHub account](https://github.com/)
- [Node.js 20+](https://nodejs.org/) (for manual setup)

---

## 🐳 Quick Docker Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/Vedantd2003/AI-Copilot-Resume-Analyzer.git
cd AI-Copilot-Resume-Analyzer
```

### 2. Environment Setup
```bash
# Backend environment
cp server/.env.example server/.env
# Edit server/.env with your API keys

# Frontend environment  
cp client/.env.example client/.env
# Edit client/.env with your backend URL
```

### 3. Launch with Docker Compose
```bash
docker-compose up --build
```

### 4. Access Your Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

---

## 🔧 Manual Deployment

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup  
```bash
cd client
npm install
npm run dev
```

---

## 📤 Push to GitHub

### Initial Setup
```bash
# Initialize git if not already done
git init
git branch -M main

# Add remote repository
git remote add origin https://github.com/Vedantd2003/AI-Copilot-Resume-Analyzer.git

# Add all files
git add .

# Create commit
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
git push -u origin main
```

---

## 🌐 Production Deployment

### Environment Variables Required

#### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_career_copilot
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=production
```

#### Client (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Docker Production Commands
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset database
docker-compose down -v
```

---

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes using ports 5173 and 5000
   netstat -ano | findstr :5173
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Docker Build Issues**
   ```bash
   # Clear Docker cache
   docker system prune -a
   docker-compose down --rmi all
   ```

3. **MongoDB Connection Issues**
   ```bash
   # Reset MongoDB volume
   docker-compose down -v
   docker-compose up mongodb
   ```

4. **Three.js/3D Graphics Issues**
   - Ensure WebGL is enabled in your browser
   - Update graphics drivers
   - Check browser console for errors

### Health Checks

```bash
# Check if services are running
docker-compose ps

# Test API endpoints
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:5173
```

---

## 📊 Monitoring

### Application Logs
```bash
# View all logs
docker-compose logs

# Follow server logs
docker-compose logs -f server

# Follow client logs
docker-compose logs -f client
```

### Performance Monitoring
- Monitor Docker resource usage
- Check MongoDB performance
- Track API response times
- Monitor 3D rendering performance

---

## 🔐 Security Notes

- **Never commit `.env` files** to version control
- **Use strong JWT secrets** in production
- **Enable HTTPS** in production
- **Configure firewall rules** properly
- **Regularly update dependencies**
- **Use MongoDB authentication** in production

---

## 🚀 Scaling

### Horizontal Scaling
```bash
# Scale multiple instances
docker-compose up --scale server=3 --scale client=2
```

### Load Balancing
- Use Nginx or Traefik for load balancing
- Configure reverse proxy for SSL termination
- Set up health checks for containers

---

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Ensure all ports are available
4. Check Docker and system resources
5. Review GitHub Issues for common problems

---

## 🎉 Success!

Your AI Career Copilot with Voice Interview is now deployed! 🎤🤖

Features available:
- ✅ AI Resume Analysis
- ✅ Job Description Matching  
- ✅ Cover Letter Generation
- ✅ **NEW: AI Voice Interview with 3D Robot**
- ✅ **NEW: Virtual Interview Room**
- ✅ **NEW: Voice Synthesis & Animations**
