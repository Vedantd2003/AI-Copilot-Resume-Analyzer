import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { uploadResume } from '../../services/aiService';
import toast from 'react-hot-toast';

export default function ResumeInput({ value, onChange, placeholder }) {
  const [uploading, setUploading]   = useState(false);
  const [fileName,  setFileName]    = useState('');
  const [dragOver,  setDragOver]    = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    setUploading(true);
    try {
      const { data } = await uploadResume(file);
      onChange(data.resumeText);
      setFileName(data.fileName);
      toast.success(`Parsed ${data.wordCount} words from your resume`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to parse PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed
          cursor-pointer transition-all duration-200
          ${dragOver
            ? 'border-brand-500 bg-brand-500/10'
            : 'border-[var(--border-bright)] hover:border-brand-500/50 hover:bg-brand-500/5'
          }`}
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="text-brand-400 animate-spin" />
            <span className="text-sm text-[var(--text-secondary)]">Parsing PDF…</span>
          </>
        ) : fileName ? (
          <>
            <FileText size={18} className="text-brand-400" />
            <span className="text-sm text-[var(--text-secondary)] truncate flex-1">{fileName}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onChange(''); setFileName(''); }}
              className="p-1 rounded hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <Upload size={18} className="text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-secondary)]">
              Drop PDF resume or <span className="text-brand-400 font-medium">click to upload</span>
            </span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Text area */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Or paste your resume text here…'}
          rows={10}
          className="input-field resize-none font-mono text-sm leading-relaxed w-full"
        />
        {value && (
          <div className="absolute bottom-3 right-3 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded">
            {value.split(' ').filter(Boolean).length} words
          </div>
        )}
      </div>
    </div>
  );
}
