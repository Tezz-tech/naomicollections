const OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value || 'newest'}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 border border-grey-light bg-white px-3 text-xs uppercase tracking-wide focus:border-gold focus:outline-none"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
