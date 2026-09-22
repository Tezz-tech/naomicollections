import { useState } from 'react';
import { useCategories } from '../../features/categories/hooks';
import { formatNaira } from '../../lib/format';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Brown', 'Gold', 'Emerald', 'Cream', 'Nude', 'Charcoal', 'Sky Blue', 'Camel'];
const SALE_TYPES = [
  { value: '', label: 'All' },
  { value: 'single', label: 'Single Only' },
  { value: 'both', label: 'Bulk Available' },
];

export default function FilterSidebar({ filters, onChange, className }) {
  const { data: categories = [] } = useCategories();
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 200000]);

  function toggle(key, value) {
    onChange({ ...filters, [key]: filters[key] === value ? '' : value });
  }

  function applyPrice() {
    onChange({ ...filters, minPrice: priceRange[0] || undefined, maxPrice: priceRange[1] || undefined });
  }

  return (
    <aside className={className}>
      <div>
        <p className="section-label mb-4">Category</p>
        <ul className="space-y-2.5">
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => toggle('category', cat._id)}
                className={`link-underline text-sm ${filters.category === cat._id ? 'text-gold' : 'text-black'}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 border-t border-grey-light pt-8">
        <p className="section-label mb-4">Price Range</p>
        <div className="flex items-center gap-2 text-xs text-grey">
          <span>{formatNaira(priceRange[0])}</span>
          <span>—</span>
          <span>{formatNaira(priceRange[1])}</span>
        </div>
        <input
          type="range"
          min={0}
          max={200000}
          step={5000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          onMouseUp={applyPrice}
          onTouchEnd={applyPrice}
          className="mt-3 w-full accent-gold"
        />
      </div>

      <div className="mt-8 border-t border-grey-light pt-8">
        <p className="section-label mb-4">Sale Type</p>
        <ul className="space-y-2.5">
          {SALE_TYPES.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => onChange({ ...filters, saleType: opt.value })}
                className={`link-underline text-sm ${filters.saleType === opt.value ? 'text-gold' : 'text-black'}`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 border-t border-grey-light pt-8">
        <p className="section-label mb-4">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggle('size', size)}
              className={`h-9 min-w-[36px] border px-2 text-xs transition-colors ${
                filters.size === size ? 'border-black bg-black text-white' : 'border-grey-light hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-grey-light pt-8">
        <p className="section-label mb-4">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => toggle('color', color)}
              className={`border px-3 py-1.5 text-xs transition-colors ${
                filters.color === color ? 'border-black bg-black text-white' : 'border-grey-light hover:border-black'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-grey-light pt-8">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked ? 'true' : '' })}
            className="h-4 w-4 accent-gold"
          />
          In Stock Only
        </label>
      </div>

      <button
        onClick={() => onChange({})}
        className="link-underline mt-8 text-xs uppercase tracking-wide text-grey"
      >
        Clear All Filters
      </button>
    </aside>
  );
}
