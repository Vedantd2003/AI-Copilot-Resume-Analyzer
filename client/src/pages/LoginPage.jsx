import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        toast.error('Please verify your email first.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--bg-secondary)] flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30">
            <Zap size={28} className="text-white" />
          </div>
          <h2 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-3">Welcome back</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Continue building your career with AI-powered tools designed to get you hired.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {['Resume Analysis', 'Job Matching', 'Cover Letters', 'Interview Prep'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-brand-400">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Zap size={20} className="text-brand-400" />
            <span className="font-display font-bold text-[var(--text-primary)]">AI Career Copilot</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-2">Sign in</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required autoComplete="email"
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label !mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} required autoComplete="current-password"
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                : <><LogIn size={18} /> Sign In</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
