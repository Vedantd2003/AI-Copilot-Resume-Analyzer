import { CheckCircle, XCircle, Lightbulb, Zap, Briefcase } from 'lucide-react';
import ScoreRing from '../ui/ScoreRing';
import { Badge, ProgressBar } from '../ui/index';

export default function JobMatchResult({ match }) {
  if (!match) return null;
  const {
    matchScore, keywordDensity, experienceMatch, educationMatch,
    matchedSkills = [], missingSkills = [], matchedRequirements = [],
    missingRequirements = [], recommendations = [], summary,
    salaryRangeEstimate, roleLevel, quickWins = [],
  } = match;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Scores */}
      <div className="card p-6">
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <ScoreRing score={matchScore}     label="Match Score"    size={130} />
          <ScoreRing score={keywordDensity} label="Keyword Density" size={130} />
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Badge variant={experienceMatch ? 'success' : 'danger'}>
            {experienceMatch ? '✓' : '✗'} Experience Match
          </Badge>
          <Badge variant={educationMatch ? 'success' : 'danger'}>
            {educationMatch ? '✓' : '✗'} Education Match
          </Badge>
          {roleLevel && <Badge variant="violet">Level: {roleLevel}</Badge>}
          {salaryRangeEstimate && <Badge variant="info">{salaryRangeEstimate}</Badge>}
        </div>
        {summary && (
          <p className="mt-4 text-center text-[var(--text-secondary)] text-sm border-t border-[var(--border)] pt-4">
            {summary}
          </p>
        )}
      </div>

      {/* Skills grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm">
            <CheckCircle size={15} className="text-emerald-400" /> Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((s, i) => <Badge key={i} variant="success">{s}</Badge>)}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm">
            <XCircle size={15} className="text-rose-400" /> Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((s, i) => <Badge key={i} variant="danger">{s}</Badge>)}
          </div>
        </div>
      </div>

      {/* Requirements */}
      {(matchedRequirements.length > 0 || missingRequirements.length > 0) && (
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2 text-sm">
            <Briefcase size={15} className="text-brand-400" /> Requirements Analysis
          </h3>
          <div className="space-y-2">
            {matchedRequirements.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span> {r}
              </div>
            ))}
            {missingRequirements.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-rose-400 mt-0.5 flex-shrink-0">✗</span> {r}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick wins */}
      {quickWins.length > 0 && (
        <div className="card p-5 border-amber-500/20 bg-amber-500/5">
          <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2 text-sm">
            <Zap size={15} /> Quick Wins
          </h3>
          <ul className="space-y-2">
            {quickWins.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">→</span> {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm">
            <Lightbulb size={15} className="text-brand-400" /> Recommendations
          </h3>
          <ul className="space-y-2">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-brand-400 mt-0.5 flex-shrink-0">·</span> {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
