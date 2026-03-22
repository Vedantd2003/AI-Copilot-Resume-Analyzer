import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Target, Mail, MessageSquare, Zap, Star, Shield, TrendingUp } from 'lucide-react';
import ThreeBackground from '../components/ui/ThreeBackground';

export default function LandingPage() {
  const heroRef   = useRef(null);
  const featRef   = useRef(null);

  // Simple CSS-based entrance animations (no GSAP dep issues in Docker)
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const features = [
    { icon: FileText,      title: 'Resume Analyzer',      desc: 'Get AI-powered feedback, ATS scoring, and keyword analysis on your resume in seconds.',         color: 'from-brand-500 to-brand-600'  },
    { icon: Target,        title: 'Job Matcher',           desc: 'Score your resume against any job description and get targeted improvement suggestions.',         color: 'from-accent-violet to-brand-500' },
    { icon: Mail,          title: 'Cover Letter AI',       desc: 'Generate personalized, compelling cover letters tailored to each role and company.',              color: 'from-accent-cyan to-accent-violet' },
    { icon: MessageSquare, title: 'Interview Prep',        desc: 'Practice with AI-generated questions and model answers specific to the role you\'re targeting.', color: 'from-accent-emerald to-accent-cyan' },
  ];

  const stats = [
    { value: '98%',  label: 'Accuracy Rate'     },
    { value: '10x',  label: 'Faster Prep'        },
    { value: '3x',   label: 'More Interviews'    },
    { value: '50K+', label: 'Careers Boosted'    },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
      `}</style>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4">
        <ThreeBackground />

        {/* Gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-8">
            <Zap size={14} />
            Powered by Google Gemini AI
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl text-[var(--text-primary)] tracking-tight leading-[1.1] mb-6">
            Your AI-Powered
            <br />
            <span className="text-gradient">Career Copilot</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Analyze resumes, match job descriptions, generate cover letters, and ace interviews —
            all powered by cutting-edge AI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="btn-primary flex items-center gap-2 text-base px-8 py-4 shadow-lg shadow-brand-500/25"
            >
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-4">
              Sign In
            </Link>
          </div>

          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mt-8 text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            <span className="text-[var(--text-secondary)] text-sm ml-2">Loved by 50,000+ professionals</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] animate-float">
          <div className="w-5 h-8 rounded-full border border-[var(--border-bright)] flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-brand-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} text-center`}>
                <div className="font-display font-bold text-4xl text-gradient mb-1">{value}</div>
                <div className="text-[var(--text-secondary)] text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section ref={featRef} className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-bright)] text-[var(--text-muted)] text-sm mb-4">
              Everything you need
            </div>
            <h2 className="section-title mb-4">Four AI-Powered Tools.<br />One Career Platform.</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              From resume analysis to interview preparation, we cover every stage of your job search journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} card card-hover p-6 group`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-display font-semibold text-[var(--text-primary)] text-lg mb-2">{title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security badges ── */}
      <section className="py-16 px-4 bg-[var(--bg-secondary)] border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center reveal">
          <Shield size={32} className="text-brand-400 mx-auto mb-4" />
          <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">Enterprise-Grade Security</h3>
          <p className="text-[var(--text-secondary)] mb-8">
            Your data is protected with JWT authentication, bcrypt hashing, and encrypted transmission.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['JWT Auth', 'Bcrypt Hashing', 'Rate Limiting', 'Helmet Security', 'Email Verification'].map((t) => (
              <span key={t} className="px-4 py-2 rounded-full border border-[var(--border-bright)] text-sm text-[var(--text-secondary)]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center reveal relative z-10">
          <h2 className="section-title mb-4">Ready to Accelerate Your Career?</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Join 50,000+ professionals using AI to land their dream jobs.
          </p>
          <Link
            to="/signup"
            className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4 shadow-lg shadow-brand-500/25"
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-4 text-center text-[var(--text-muted)] text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={14} className="text-brand-400" />
          <span className="font-display font-semibold text-[var(--text-primary)]">AI Career Copilot</span>
        </div>
        <p>© {new Date().getFullYear()} AI Career Copilot. Built with ❤️ using MERN + Gemini AI.</p>
      </footer>
    </div>
  );
}
