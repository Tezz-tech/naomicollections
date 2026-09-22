import { useDeliveryZones } from '../../features/deliveryZones/hooks';
import LegalPage from '../../components/legal/LegalPage';
import { Skeleton } from '../../components/ui';
import { formatNaira } from '../../lib/format';

export default function Shipping() {
  const { data, isLoading } = useDeliveryZones();

  return (
    <LegalPage title="Shipping Information">
      <p>
        Orders are processed within 1-2 business days. Delivery fees and timelines depend on
        your state, and are calculated automatically at checkout.
        {data?.freeDeliveryThreshold && (
          <> Orders at or above {formatNaira(data.freeDeliveryThreshold)} qualify for free delivery.</>
        )}
      </p>

      <h2>Delivery Timelines by State</h2>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="not-prose overflow-hidden border border-grey-light">
          <table className="w-full text-sm">
            <thead className="bg-offwhite text-left text-xs uppercase tracking-wide text-grey">
              <tr>
                <th className="px-4 py-2.5">State</th>
                <th className="px-4 py-2.5">Fee</th>
                <th className="px-4 py-2.5">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {data?.zones?.map((zone) => (
                <tr key={zone._id} className="border-t border-grey-light">
                  <td className="px-4 py-2.5">{zone.state}</td>
                  <td className="px-4 py-2.5">{formatNaira(zone.fee)}</td>
                  <td className="px-4 py-2.5">{zone.minDays}-{zone.maxDays} business days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Order Tracking</h2>
      <p>
        Once your order is placed, you can track its status at any time from your account's
        order history, or via the tracking link sent in your confirmation email.
      </p>
    </LegalPage>
  );
}
