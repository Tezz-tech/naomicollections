import { useMemo } from 'react';

export default function VariantSelector({ variants = [], selectedSize, selectedColor, onChange }) {
  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size).filter(Boolean))], [variants]);
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color).filter(Boolean))], [variants]);

  function stockFor(size, color) {
    const variant = variants.find(
      (v) => (size ? v.size === size : true) && (color ? v.color === color : true)
    );
    return variant?.stock ?? null;
  }

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <p className="section-label mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const stock = stockFor(size, selectedColor);
              const disabled = stock === 0;
              return (
                <button
                  key={size}
                  disabled={disabled}
                  onClick={() => onChange({ size, color: selectedColor })}
                  className={`h-10 min-w-[42px] border px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                    selectedSize === size ? 'border-black bg-black text-white' : 'border-grey-light hover:border-black'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="section-label mb-3">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const stock = stockFor(selectedSize, color);
              const disabled = stock === 0;
              return (
                <button
                  key={color}
                  disabled={disabled}
                  onClick={() => onChange({ size: selectedSize, color })}
                  className={`border px-3 py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                    selectedColor === color ? 'border-black bg-black text-white' : 'border-grey-light hover:border-black'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
