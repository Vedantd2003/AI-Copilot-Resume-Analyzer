import { useState } from 'react';
import { Target, Sparkles, RotateCcw } from 'lucide-react';
import { matchJobDescription } from '../services/aiService';
import ResumeInput from '../components/resume/ResumeInput';
import JobMatchResult from '../components/resume/JobMatchResult';
import { SectionHeader, Badge, Spinner, Textarea } from '../components/ui/index';
import toast from 'react-hot-toast';

export default function JobMatcher() {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc]       = useState('');
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);

  const handleMatch = async () => {
    if (!resumeText.trim() || resumeText.length < 50) {
      toast.error('Please provide your resume text'); return;
    }
    if (!jobDesc.trim() || jobDesc.length < 50) {
      toast.error('Please paste the job description'); return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await matchJobDescription(resumeText, jobDesc);
      setResult(data.match);
      toast.success('Match analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Matching failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResumeText(''); setJobDesc(''); setResult(null); };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Job Description Matcher"
        subtitle="Score your resume against any job description and get targeted suggestions."
        badge={<Badge variant="violet"><Target size={12} /> Smart Matching</Badge>}
      />

      {!result ? (
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm">Your Resume</h3>
            <ResumeInput value={resumeText} onChange={setResumeText} />
          </div>

          <div className="card p-6">
            <Textarea
              label="Job Description"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={10}
            />
          </div>

          <button
            onClick={handleMatch}
            disabled={loading || !resumeText.trim() || !jobDesc.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            {loading
              ? <><Spinner size="sm" /> Matching with AI…</>
              : <><Sparkles size={18} /> Match Resume to JD</>
            }
          </button>
          {loading && (
            <p className="text-center text-sm text-[var(--text-muted)] animate-pulse">
              Comparing skills, keywords, and requirements…
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-[var(--text-primary)]">Match Results</h2>
            <button onClick={handleReset} className="btn-ghost flex items-center gap-2 text-sm">
              <RotateCcw size={15} /> New Match
            </button>
          </div>
          <JobMatchResult match={result} />
        </div>
      )}
    </div>
  );
}
