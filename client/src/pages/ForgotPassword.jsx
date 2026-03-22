import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Zap, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-10">
          <Zap size={20} className="text-brand-400" />
          <span className="font-display font-bold text-[var(--text-primary)]">AI Career Copilot</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">Check your email</h1>
            <p className="text-[var(--text-secondary)] mb-8">
              If an account with <strong className="text-[var(--text-primary)]">{email}</strong> exists, we sent a reset link.
            </p>
            <Link to="/login" className="btn-primary inline-flex">Back to Sign In</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-2">Reset password</h1>
            <p className="text-[var(--text-secondary)] mb-8">
              Enter your email and we'll send a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    required placeholder="you@example.com"
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                  : 'Send Reset Link'
                }
              </button>
            </form>
            <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
              <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">← Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
