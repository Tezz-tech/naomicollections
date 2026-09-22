import { useMyBulkRequests } from '../../features/bulkRequests/hooks';
import { Badge, Card, Skeleton } from '../../components/ui';
import { formatDate, formatNaira } from '../../lib/format';

const STATUS_VARIANT = { new: 'gold', quoted: 'black', converted: 'success', closed: 'outline' };

export default function AccountBulkRequests() {
  const { data: requests, isLoading } = useMyBulkRequests();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!requests?.length) {
    return <p className="text-sm text-grey">You haven't submitted any bulk quote requests yet.</p>;
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <Card key={req._id} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-serif text-lg">{req.items.length} item(s)</p>
              <p className="text-xs text-grey">{formatDate(req.createdAt)} &middot; delivering to {req.deliveryLocation}</p>
            </div>
            <Badge variant={STATUS_VARIANT[req.status]}>{req.status}</Badge>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-grey">
            {req.items.map((item, i) => (
              <li key={i}>{item.name} &times; {item.quantity}</li>
            ))}
          </ul>
          {req.quote?.amount && (
            <div className="mt-4 border-t border-grey-light pt-3">
              <p className="text-sm">Quoted: <span className="text-gold">{formatNaira(req.quote.amount)}</span></p>
              {req.quote.notes && <p className="mt-1 text-xs text-grey">{req.quote.notes}</p>}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
