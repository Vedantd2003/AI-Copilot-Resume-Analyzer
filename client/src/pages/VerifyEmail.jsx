// VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Zap } from 'lucide-react';
import api from '../services/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); setMessage('No verification token found.'); return; }

    api.post('/auth/verify-email', { token })
      .then(({ data }) => { setStatus('success'); setMessage(data.message); })
      .catch((err) => { setStatus('error'); setMessage(err.response?.data?.error || 'Verification failed.'); });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-6">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Zap size={20} className="text-brand-400" />
          <span className="font-display font-bold text-[var(--text-primary)]">AI Career Copilot</span>
        </div>

        {status === 'loading' && (
          <>
            <Loader2 size={48} className="text-brand-400 animate-spin mx-auto mb-4" />
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Verifying your email…</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">Email Verified!</h1>
            <p className="text-[var(--text-secondary)] mb-8">{message}</p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">Sign In Now</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-rose-500/15 flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-rose-400" />
            </div>
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">Verification Failed</h1>
            <p className="text-[var(--text-secondary)] mb-8">{message}</p>
            <Link to="/signup" className="btn-primary inline-flex items-center gap-2">Sign Up Again</Link>
          </>
        )}
      </div>
    </div>
  );
}
