import { formatNaira, formatDate } from '../../lib/format';
import { getUnitPrice } from '../../lib/pricing';
import { Loader2 } from 'lucide-react';

export default function OrderSummary({ items, quote, isQuoting }) {
  const subtotal =
    quote?.subtotal ?? items.reduce((sum, i) => sum + getUnitPrice(i, i.quantity, i.variantSku) * i.quantity, 0);

  return (
    <div className="h-fit border border-grey-light p-6">
      <h2 className="section-label mb-5">Order Summary</h2>

      <ul className="max-h-64 space-y-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.key} className="flex gap-3">
            <div className="relative h-16 w-14 shrink-0 bg-offwhite">
              {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs leading-snug">{item.name}</p>
              {(item.size || item.color) && (
                <p className="text-[11px] text-grey">{[item.color, item.size].filter(Boolean).join(' / ')}</p>
              )}
            </div>
            <span className="text-xs text-gold">
              {formatNaira(getUnitPrice(item, item.quantity, item.variantSku) * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-2.5 border-t border-grey-light pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-grey">Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        {quote?.discount > 0 && (
          <div className="flex justify-between text-status-success">
            <span>Discount</span>
            <span>-{formatNaira(quote.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-grey">
          <span>Delivery</span>
          <span className="flex items-center gap-1.5">
            {isQuoting && <Loader2 className="h-3 w-3 animate-spin" />}
            {quote ? (quote.deliveryFee ? formatNaira(quote.deliveryFee) : 'Free') : 'Enter address'}
          </span>
        </div>
      </div>

      <div className="mt-5 flex justify-between border-t border-grey-light pt-5 font-serif text-lg">
        <span>Total</span>
        <span className="text-gold">{formatNaira(quote?.total ?? subtotal)}</span>
      </div>

      {quote?.estimatedDeliveryDate && (
        <p className="mt-3 text-xs text-grey">
          Estimated delivery by <strong>{formatDate(quote.estimatedDeliveryDate)}</strong>
          {quote.deliveryWindow && ` (${quote.deliveryWindow.minDays}-${quote.deliveryWindow.maxDays} business days)`}
        </p>
      )}
    </div>
  );
}
