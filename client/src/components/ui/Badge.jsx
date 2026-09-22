import clsx from 'clsx';

const variants = {
  gold: 'bg-gold/10 text-gold-dark border-gold/40',
  black: 'bg-black text-white border-black',
  outline: 'bg-transparent text-black border-black',
  success: 'bg-status-success/10 text-status-success border-status-success/30',
  error: 'bg-status-error/10 text-status-error border-status-error/30',
  warning: 'bg-status-warning/10 text-status-warning border-status-warning/30',
};

export default function Badge({ children, variant = 'gold', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-sharp border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
