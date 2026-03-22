export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-brand-500/15 text-brand-400 border border-brand-500/20',
    success:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    warning:  'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    danger:   'bg-rose-500/15 text-rose-400 border border-rose-500/20',
    info:     'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
    violet:   'bg-violet-500/15 text-violet-400 border border-violet-500/20',
    muted:    'bg-[var(--border)] text-[var(--text-muted)]',
  };
  return (
    <span className={`badge ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value = 0, color, className = '' }) {
  const getColor = (v) => {
    if (color) return color;
    if (v >= 80) return '#10b981';
    if (v >= 60) return '#f59e0b';
    if (v >= 40) return '#f97316';
    return '#f43f5e';
  };
  return (
    <div className={`score-bar ${className}`}>
      <div
        className="score-bar-fill"
        style={{
          width: `${Math.min(value, 100)}%`,
          backgroundColor: getColor(value),
          boxShadow: `0 0 8px ${getColor(value)}60`,
        }}
      />
    </div>
  );
}

export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border', md: 'w-7 h-7 border-2', lg: 'w-10 h-10 border-2' };
  return (
    <div className={`${sizes[size]} border-brand-500 border-t-transparent rounded-full animate-spin ${className}`} />
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
        <Icon size={28} className="text-brand-400" />
      </div>
      <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionHeader({ title, subtitle, badge }) {
  return (
    <div className="mb-6">
      {badge && <div className="mb-2">{badge}</div>}
      <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--text-primary)] tracking-tight">{title}</h1>
      {subtitle && <p className="text-[var(--text-secondary)] mt-1">{subtitle}</p>}
    </div>
  );
}

export function Divider({ className = '' }) {
  return <div className={`h-px bg-[var(--border)] ${className}`} />;
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <textarea
        className={`input-field resize-none ${error ? 'border-rose-500/60 focus:ring-rose-500/40' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-rose-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input
        className={`input-field ${error ? 'border-rose-500/60 focus:ring-rose-500/40' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-rose-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
