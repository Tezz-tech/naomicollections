import { formatNaira } from '../../lib/format';

export default function BulkPriceTable({ minOrderQuantity, bulkTiers = [], quantity }) {
  if (!bulkTiers.length) return null;

  const sorted = [...bulkTiers].sort((a, b) => a.minQty - b.minQty);

  return (
    <div className="border border-grey-light">
      <div className="bg-offwhite px-4 py-2.5">
        <p className="section-label">Bulk Pricing — Min. Order {minOrderQuantity} units</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-grey-light text-left text-xs uppercase tracking-wide text-grey">
            <th className="px-4 py-2.5 font-medium">Quantity</th>
            <th className="px-4 py-2.5 font-medium">Price / Unit</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((tier) => {
            const isActive = quantity >= tier.minQty && (tier.maxQty == null || quantity <= tier.maxQty);
            return (
              <tr
                key={tier.minQty}
                className={`border-b border-grey-light last:border-0 ${isActive ? 'bg-gold/10' : ''}`}
              >
                <td className="px-4 py-2.5">
                  {tier.minQty}
                  {tier.maxQty ? `–${tier.maxQty}` : '+'} units
                </td>
                <td className={`px-4 py-2.5 ${isActive ? 'font-medium text-gold-dark' : ''}`}>
                  {formatNaira(tier.pricePerUnit)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
