import { useState } from 'react';
import { FileText, Sparkles, RotateCcw } from 'lucide-react';
import { analyzeResume } from '../services/aiService';
import ResumeInput from '../components/resume/ResumeInput';
import ResumeAnalysisResult from '../components/resume/ResumeAnalysisResult';
import { SectionHeader, Badge, Spinner } from '../components/ui/index';
import toast from 'react-hot-toast';

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.length < 50) {
      toast.error('Please enter your resume text (at least 50 characters)');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await analyzeResume(resumeText);
      setResult(data.analysis);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResumeText(''); setResult(null); };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Resume Analyzer"
        subtitle="Get AI-powered feedback, ATS score, and keyword analysis on your resume."
        badge={<Badge variant="default"><FileText size={12} /> AI-Powered</Badge>}
      />

      {!result ? (
        <div className="card p-6 space-y-5">
          <ResumeInput value={resumeText} onChange={setResumeText} />
          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            {loading
              ? <><Spinner size="sm" /> Analyzing with Gemini AI…</>
              : <><Sparkles size={18} /> Analyze Resume</>
            }
          </button>
          {loading && (
            <p className="text-center text-sm text-[var(--text-muted)] animate-pulse">
              AI is reviewing your resume… this may take 15-30 seconds
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-[var(--text-primary)]">Analysis Results</h2>
            <button onClick={handleReset} className="btn-ghost flex items-center gap-2 text-sm">
              <RotateCcw size={15} /> Analyze New Resume
            </button>
          </div>
          <ResumeAnalysisResult analysis={result} />
        </div>
      )}
    </div>
  );
}
