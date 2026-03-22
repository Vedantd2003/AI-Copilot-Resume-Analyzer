import api from './api';

export const analyzeResume = (resumeText) =>
  api.post('/ai/analyze-resume', { resumeText });

export const matchJobDescription = (resumeText, jobDescription) =>
  api.post('/ai/match-jd', { resumeText, jobDescription });

export const generateCoverLetter = (resumeText, jobDescription, companyName, hiringManagerName) =>
  api.post('/ai/cover-letter', { resumeText, jobDescription, companyName, hiringManagerName });

export const generateInterviewPrep = (resumeText, jobDescription, questionCount = 10) =>
  api.post('/ai/interview-prep', { resumeText, jobDescription, questionCount });

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/user/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getDashboard = () => api.get('/user/dashboard');
export const getHistory   = (params) => api.get('/user/history', { params });
