import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Layout         from './components/layout/Layout';
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import SignupPage     from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import DashboardPage  from './pages/DashboardPage';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobMatcher     from './pages/JobMatcher';
import CoverLetter    from './pages/CoverLetter';
import InterviewPrep  from './pages/InterviewPrep';
import VoiceInterview from './pages/VoiceInterview';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#13131e',
                color: '#f8fafc',
                border: '1px solid #1e1e30',
                borderRadius: '12px',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/"               element={<LandingPage />} />
            <Route path="/login"          element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup"         element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password"  element={<ResetPassword />} />

            {/* Protected */}
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/dashboard"   element={<DashboardPage />} />
              <Route path="/resume"      element={<ResumeAnalyzer />} />
              <Route path="/job-match"   element={<JobMatcher />} />
              <Route path="/cover-letter" element={<CoverLetter />} />
              <Route path="/interview"   element={<InterviewPrep />} />
              <Route path="/voice-interview" element={<VoiceInterview />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
