import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, MessageSquare } from 'lucide-react';
import { Badge } from '../ui/index';

const difficultyVariant = { Easy: 'success', Medium: 'warning', Hard: 'danger' };
const categoryVariant   = {
  Technical: 'default', Behavioral: 'violet', Situational: 'info',
  'Culture Fit': 'success', Leadership: 'warning',
};

export default function InterviewQuestionCard({ question, index }) {
  const [open, setOpen] = useState(false);
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="card card-hover overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-brand-400 text-sm font-bold">{index}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={categoryVariant[question.category] || 'default'}>{question.category}</Badge>
            <Badge variant={difficultyVariant[question.difficulty] || 'muted'}>{question.difficulty}</Badge>
          </div>
          <p className="text-[var(--text-primary)] font-medium text-sm leading-relaxed">
            {question.question}
          </p>
        </div>
        <div className="flex-shrink-0 ml-2 text-[var(--text-muted)]">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-[var(--border)] px-5 pb-5 pt-4 space-y-4">
          {/* Model answer */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} className="text-brand-400" />
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Model Answer</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-secondary)] p-4 rounded-xl">
              {question.modelAnswer}
            </p>
          </div>

          {/* Tips */}
          {question.tips?.length > 0 && (
            <div>
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Lightbulb size={14} />
                {showTips ? 'Hide' : 'Show'} Tips ({question.tips.length})
              </button>
              {showTips && (
                <ul className="mt-2 space-y-1">
                  {question.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-amber-400 mt-0.5">→</span> {tip}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Follow-ups */}
          {question.followUpQuestions?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Possible Follow-ups
              </p>
              <ul className="space-y-1">
                {question.followUpQuestions.map((fq, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                    <span className="text-[var(--text-muted)] flex-shrink-0">·</span> {fq}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
