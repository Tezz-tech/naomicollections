import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <div className="mt-14 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
        className="p-2 disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {nums.map((n, i) => (
        <span key={n} className="flex items-center">
          {i > 0 && nums[i - 1] !== n - 1 && <span className="px-1 text-grey">…</span>}
          <button
            onClick={() => onChange(n)}
            className={`flex h-9 w-9 items-center justify-center text-sm transition-colors ${
              n === page ? 'bg-black text-white' : 'hover:bg-offwhite'
            }`}
          >
            {n}
          </button>
        </span>
      ))}

      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
        className="p-2 disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
