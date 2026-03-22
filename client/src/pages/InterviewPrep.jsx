import { useState } from 'react';
import { MessageSquare, Sparkles, RotateCcw, Brain, Shield } from 'lucide-react';
import { generateInterviewPrep } from '../services/aiService';
import ResumeInput from '../components/resume/ResumeInput';
import InterviewQuestionCard from '../components/interview/InterviewQuestionCard';
import { SectionHeader, Badge, Spinner, Textarea } from '../components/ui/index';
import toast from 'react-hot-toast';

export default function InterviewPrep() {
  const [resumeText, setResumeText]     = useState('');
  const [jobDesc, setJobDesc]           = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [result, setResult]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleGenerate = async () => {
    if (!resumeText.trim() || resumeText.length < 50) {
      toast.error('Please provide your resume text'); return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await generateInterviewPrep(resumeText, jobDesc, questionCount);
      setResult(data.interview);
      setActiveCategory('All');
      toast.success(`Generated ${data.interview.totalQuestions} questions!`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResumeText(''); setJobDesc(''); setResult(null); };

  const categories = result
    ? ['All', ...Object.keys(result.categories || {}).filter((k) => result.categories[k] > 0)]
    : [];

  const filteredQuestions = result?.questions?.filter(
    (q) => activeCategory === 'All' || q.category === activeCategory
  ) || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mock Interview Prep"
        subtitle="Get AI-generated questions with model answers tailored to your profile and target role."
        badge={<Badge variant="success"><Brain size={12} /> AI Interview Coach</Badge>}
      />

      {!result ? (
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm">Your Resume</h3>
            <ResumeInput value={resumeText} onChange={setResumeText} />
          </div>

          <div className="card p-6 space-y-4">
            <Textarea
              label="Job Description (optional but recommended)"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job description for role-specific questions…"
              rows={6}
            />
            <div>
              <label className="label">Number of Questions</label>
              <div className="flex gap-3">
                {[5, 8, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${questionCount === n
                        ? 'bg-brand-500 text-white'
                        : 'border border-[var(--border-bright)] text-[var(--text-secondary)] hover:border-brand-500/50'
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !resumeText.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            {loading
              ? <><Spinner size="sm" /> Generating questions…</>
              : <><Sparkles size={18} /> Generate Interview Questions</>
            }
          </button>
          {loading && (
            <p className="text-center text-sm text-[var(--text-muted)] animate-pulse">
              Crafting {questionCount} tailored questions with model answers…
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-[var(--text-primary)]">
                {result.totalQuestions} Interview Questions
              </h2>
              <p className="text-sm text-[var(--text-muted)]">Click any question to see the model answer</p>
            </div>
            <button onClick={handleReset} className="btn-ghost flex items-center gap-2 text-sm">
              <RotateCcw size={15} /> Regenerate
            </button>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                  ${activeCategory === cat
                    ? 'bg-brand-500 text-white'
                    : 'border border-[var(--border-bright)] text-[var(--text-secondary)] hover:border-brand-500/50'
                  }`}
              >
                {cat} {cat !== 'All' && result.categories[cat] ? `(${result.categories[cat]})` : ''}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {filteredQuestions.map((q, i) => (
              <InterviewQuestionCard key={q.id || i} question={q} index={i + 1} />
            ))}
          </div>

          {/* Tips */}
          {result.preparationTips?.length > 0 && (
            <div className="card p-5 border-brand-500/20 bg-brand-500/5">
              <h3 className="font-semibold text-brand-400 mb-3 flex items-center gap-2 text-sm">
                <Shield size={15} /> Preparation Tips
              </h3>
              <ul className="space-y-2">
                {result.preparationTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="text-brand-400 mt-0.5 flex-shrink-0">→</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Red flags */}
          {result.redFlags?.length > 0 && (
            <div className="card p-5 border-rose-500/20 bg-rose-500/5">
              <h3 className="font-semibold text-rose-400 mb-3 text-sm">⚠️ Common Mistakes to Avoid</h3>
              <ul className="space-y-2">
                {result.redFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="text-rose-400 mt-0.5 flex-shrink-0">✗</span> {flag}
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
