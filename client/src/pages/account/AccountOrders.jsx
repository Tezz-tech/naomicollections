import { Link } from 'react-router-dom';
import { useMyOrders } from '../../features/orders/hooks';
import { Badge, Card, Skeleton } from '../../components/ui';
import { formatDate, formatNaira } from '../../lib/format';

const STATUS_VARIANT = {
  pending: 'warning',
  confirmed: 'gold',
  processing: 'gold',
  shipped: 'black',
  out_for_delivery: 'black',
  delivered: 'success',
  cancelled: 'error',
};

export default function AccountOrders() {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  if (!orders?.length) {
    return <p className="text-sm text-grey">You haven't placed any orders yet.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link key={order._id} to={`/order/${order.orderNumber}`}>
          <Card hover className="flex items-center justify-between p-5">
            <div>
              <p className="font-serif text-lg">{order.orderNumber}</p>
              <p className="text-xs text-grey">{formatDate(order.createdAt)} &middot; {order.items.length} item(s)</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={STATUS_VARIANT[order.status] || 'outline'}>{order.status.replace(/_/g, ' ')}</Badge>
              <span className="text-gold">{formatNaira(order.total)}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
