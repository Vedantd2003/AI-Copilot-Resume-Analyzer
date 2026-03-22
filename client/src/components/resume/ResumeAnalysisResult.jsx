import { CheckCircle, XCircle, AlertCircle, TrendingUp, Cpu, Hash } from 'lucide-react';
import ScoreRing from '../ui/ScoreRing';
import { Badge, ProgressBar } from '../ui/index';

const PriorityIcon = ({ priority }) => {
  if (priority === 'high')   return <XCircle size={14} className="text-rose-400" />;
  if (priority === 'medium') return <AlertCircle size={14} className="text-amber-400" />;
  return <CheckCircle size={14} className="text-emerald-400" />;
};

export default function ResumeAnalysisResult({ analysis }) {
  if (!analysis) return null;
  const { overallScore, atsScore, strengths = [], weaknesses = [], suggestions = [],
    keywordsFound = [], missingKeywords = [], sectionScores = {}, topImprovements = [],
    impactStatement } = analysis;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top scores */}
      <div className="card p-6">
        <div className="flex flex-wrap justify-center gap-8 mb-5">
          <ScoreRing score={overallScore} label="Overall Score" size={130} />
          <ScoreRing score={atsScore}     label="ATS Score"     size={130} />
        </div>
        {impactStatement && (
          <p className="text-center text-[var(--text-secondary)] text-sm italic border-t border-[var(--border)] pt-4">
            "{impactStatement}"
          </p>
        )}
      </div>

      {/* Section scores */}
      {Object.keys(sectionScores).length > 0 && (
        <div className="card p-6">
          <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-400" /> Section Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(sectionScores).map(([section, score]) => (
              <div key={section}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--text-secondary)] capitalize">{section}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{score}/100</span>
                </div>
                <ProgressBar value={score} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm">
            <CheckCircle size={15} className="text-emerald-400" /> Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm">
            <XCircle size={15} className="text-rose-400" /> Areas to Improve
          </h3>
          <ul className="space-y-2">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-rose-400 mt-0.5 flex-shrink-0">✗</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Keywords */}
      <div className="card p-5">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm">
          <Hash size={15} className="text-brand-400" /> Keywords
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Found</p>
            <div className="flex flex-wrap gap-2">
              {keywordsFound.map((k, i) => <Badge key={i} variant="success">{k}</Badge>)}
            </div>
          </div>
          {missingKeywords.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Missing</p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((k, i) => <Badge key={i} variant="danger">{k}</Badge>)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top improvements */}
      {topImprovements?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm">
            <Cpu size={15} className="text-accent-violet" /> AI Recommendations
          </h3>
          <div className="space-y-3">
            {topImprovements.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]">
                <PriorityIcon priority={item.priority} />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.action}</p>
                  {item.reason && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.reason}</p>}
                </div>
                <Badge
                  variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'success'}
                  className="ml-auto flex-shrink-0"
                >
                  {item.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm">
            <AlertCircle size={15} className="text-amber-400" /> Suggestions
          </h3>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-amber-400 mt-1 flex-shrink-0">→</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
