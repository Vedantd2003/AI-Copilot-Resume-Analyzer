import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { signup }  = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass]  = useState(false);
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState('');

  const passwordStrength = () => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthColors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strength = passwordStrength();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 3) { setError('Please choose a stronger password.'); return; }
    setLoading(true);
    setError('');
    try {
      await signup(form.name, form.email, form.password);
      // Redirect to dashboard immediately after successful signup
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--bg-secondary)] flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-accent-violet/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Zap size={28} className="text-white" />
          </div>
          <h2 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-3">Start your journey</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Join thousands of professionals who landed their dream jobs using AI Career Copilot.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Zap size={20} className="text-brand-400" />
            <span className="font-display font-bold text-[var(--text-primary)]">AI Career Copilot</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-2">Create account</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} required autoComplete="name"
                placeholder="Jane Doe"
                className="input-field"
              />
            </div>

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
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} required autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="input-field pr-12"
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColors[strength] : 'bg-[var(--border)]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {strengthLabels[strength]} — use uppercase, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
                : <><UserPlus size={18} /> Create Account</>
              }
            </button>

            <p className="text-xs text-[var(--text-muted)] text-center">
              By signing up, you agree to our{' '}
              <span className="text-brand-400 cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-brand-400 cursor-pointer">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
