import { useState } from 'react';
import { Mail, Sparkles, RotateCcw, Copy, Check } from 'lucide-react';
import { generateCoverLetter } from '../services/aiService';
import ResumeInput from '../components/resume/ResumeInput';
import { SectionHeader, Badge, Spinner, Textarea, Input } from '../components/ui/index';
import toast from 'react-hot-toast';

export default function CoverLetter() {
  const [resumeText, setResumeText]   = useState('');
  const [jobDesc, setJobDesc]         = useState('');
  const [companyName, setCompanyName] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [result, setResult]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [copied, setCopied]           = useState(false);

  const handleGenerate = async () => {
    if (!resumeText.trim() || resumeText.length < 50) {
      toast.error('Please provide your resume text'); return;
    }
    if (!jobDesc.trim() || jobDesc.length < 50) {
      toast.error('Please paste the job description'); return;
    }
    setLoading(true);
    setResult('');
    try {
      const { data } = await generateCoverLetter(resumeText, jobDesc, companyName, hiringManager);
      setResult(data.coverLetter);
      toast.success('Cover letter generated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResumeText(''); setJobDesc(''); setCompanyName('');
    setHiringManager(''); setResult('');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Cover Letter Generator"
        subtitle="Generate personalized, compelling cover letters in seconds with AI."
        badge={<Badge variant="info"><Mail size={12} /> AI-Generated</Badge>}
      />

      {!result ? (
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm">Your Resume</h3>
            <ResumeInput value={resumeText} onChange={setResumeText} />
          </div>

          <div className="card p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Company Name (optional)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google, Acme Corp"
              />
              <Input
                label="Hiring Manager Name (optional)"
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                placeholder="e.g. Sarah Johnson"
              />
            </div>
            <Textarea
              label="Job Description"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={8}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !resumeText.trim() || !jobDesc.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            {loading
              ? <><Spinner size="sm" /> Crafting your cover letter…</>
              : <><Sparkles size={18} /> Generate Cover Letter</>
            }
          </button>
          {loading && (
            <p className="text-center text-sm text-[var(--text-muted)] animate-pulse">
              Writing a personalized letter tailored to the role…
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-[var(--text-primary)]">Your Cover Letter</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
                {copied ? <><Check size={15} className="text-emerald-400" /> Copied!</> : <><Copy size={15} /> Copy</>}
              </button>
              <button onClick={handleReset} className="btn-ghost flex items-center gap-2 text-sm">
                <RotateCcw size={15} /> Generate New
              </button>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            <pre className="whitespace-pre-wrap font-body text-sm text-[var(--text-secondary)] leading-relaxed">
              {result}
            </pre>
          </div>

          <p className="text-xs text-[var(--text-muted)] text-center">
            Review and personalize this letter before sending. AI-generated content may need adjustments.
          </p>
        </div>
      )}
    </div>
  );
}
