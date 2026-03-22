import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Target, Mail, MessageSquare, TrendingUp,
  ArrowRight, Clock, BarChart2,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { getDashboard } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { Badge, SectionHeader } from '../components/ui/index';

const typeConfig = {
  resume_analysis: { label: 'Resume Analysis', icon: FileText,      color: 'text-brand-400',    bg: 'bg-brand-500/10'    },
  jd_match:        { label: 'Job Match',        icon: Target,        color: 'text-violet-400',   bg: 'bg-violet-500/10'   },
  cover_letter:    { label: 'Cover Letter',     icon: Mail,          color: 'text-cyan-400',     bg: 'bg-cyan-500/10'     },
  interview_prep:  { label: 'Interview Prep',   icon: MessageSquare, color: 'text-emerald-400',  bg: 'bg-emerald-500/10'  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card px-4 py-3 shadow-xl text-sm">
        <p className="text-[var(--text-muted)] mb-1">{label}</p>
        <p className="font-semibold text-[var(--text-primary)]">{payload[0].value}/100</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonDashboard />;

  const { stats = {}, scoreTrend = [], matchTrend = [], recentActivity = [] } = data || {};

  const statCards = [
    { label: 'Resumes Analyzed',  value: stats.totalAnalyses,     icon: FileText,      color: 'text-brand-400',   bg: 'bg-brand-500/10'   },
    { label: 'Job Matches',        value: stats.totalMatches,       icon: Target,        color: 'text-violet-400',  bg: 'bg-violet-500/10'  },
    { label: 'Cover Letters',      value: stats.totalCoverLetters,  icon: Mail,          color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
    { label: 'Interview Sessions', value: stats.totalInterviews,    icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const quickLinks = [
    { to: '/resume',       label: 'Analyze Resume',    icon: FileText,      color: 'from-brand-500 to-brand-600'          },
    { to: '/job-match',   label: 'Match a Job',        icon: Target,        color: 'from-violet-500 to-brand-500'         },
    { to: '/cover-letter', label: 'Generate Cover Letter', icon: Mail,      color: 'from-cyan-500 to-violet-500'          },
    { to: '/interview',    label: 'Prep Interview',     icon: MessageSquare, color: 'from-emerald-500 to-cyan-500'        },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's your career progress at a glance."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card card-hover p-5">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className="font-display font-bold text-2xl text-[var(--text-primary)]">{value ?? 0}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Score averages */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
            <BarChart2 size={22} className="text-brand-400" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-1">Avg. Resume Score</div>
            <div className="font-display font-bold text-3xl text-[var(--text-primary)]">
              {stats.avgResumeScore ?? 0}<span className="text-lg text-[var(--text-muted)]">/100</span>
            </div>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={22} className="text-violet-400" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-1">Avg. Match Score</div>
            <div className="font-display font-bold text-3xl text-[var(--text-primary)]">
              {stats.avgMatchScore ?? 0}<span className="text-lg text-[var(--text-muted)]">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {(scoreTrend.length > 0 || matchTrend.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {scoreTrend.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-4">Resume Score Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {matchTrend.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-4">Job Match Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={matchTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="font-display font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="card card-hover p-4 flex flex-col items-center gap-3 text-center group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Clock size={16} className="text-[var(--text-muted)]" /> Recent Activity
            </h2>
          </div>
          <div className="space-y-2">
            {recentActivity.map((item) => {
              const cfg = typeConfig[item.type] || typeConfig.resume_analysis;
              const Icon = cfg.icon;
              return (
                <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={15} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{cfg.label}</p>
                    {item.companyName && (
                      <p className="text-xs text-[var(--text-muted)]">{item.companyName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {item.score != null && (
                      <Badge variant={item.score >= 70 ? 'success' : item.score >= 50 ? 'warning' : 'danger'}>
                        {item.score}/100
                      </Badge>
                    )}
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recentActivity.length === 0 && (
        <div className="card p-10 text-center">
          <BarChart2 size={40} className="text-[var(--text-muted)] mx-auto mb-3" />
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">No activity yet</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-5">Start by analyzing your resume or matching a job description.</p>
          <Link to="/resume" className="btn-primary inline-flex items-center gap-2">
            Analyze Resume <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
