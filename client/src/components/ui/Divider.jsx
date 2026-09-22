import clsx from 'clsx';

/**
 * Section title flanked by thin gold lines, echoing the crest logo's
 * laurel/line motif beside "COLLECTIONS".
 */
export default function Divider({ label, className }) {
  if (!label) {
    return <hr className={clsx('border-t border-grey-light', className)} />;
  }

  return (
    <div className={clsx('section-heading', className)}>
      <span className="section-label whitespace-nowrap">{label}</span>
    </div>
  );
}
