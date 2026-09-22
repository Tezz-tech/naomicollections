import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useOrder } from '../features/orders/hooks';
import OrderTimeline from '../components/account/OrderTimeline';
import { Button, Divider, Skeleton } from '../components/ui';
import { formatNaira, formatDate } from '../lib/format';

export default function OrderTracking() {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const { data: order, isLoading, isError } = useOrder(orderNumber, email);

  if (isLoading) {
    return (
      <div className="container-luxury py-16">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto mt-6 h-40 max-w-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container-luxury flex flex-col items-center py-24 text-center">
        <Package className="h-10 w-10 text-grey" />
        <p className="mt-4 font-serif text-2xl">Order Not Found</p>
        <p className="mt-2 text-sm text-grey">
          We couldn't find that order, or you don't have access to view it. Guests should include
          the email used at checkout as <code>?email=you@example.com</code> in the link.
        </p>
        <Button as={Link} to="/" className="mt-6">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="container-luxury py-12">
      <Divider label="Order Tracking" />
      <h1 className="mt-4 text-center font-serif text-3xl">{order.orderNumber}</h1>
      <p className="mt-2 text-center text-sm text-grey">Placed on {formatDate(order.createdAt)}</p>

      <div className="mx-auto mt-12 max-w-3xl border border-grey-light p-8">
        <OrderTimeline status={order.status} statusHistory={order.statusHistory} />
      </div>

      <div className="mx-auto mt-10 max-w-3xl grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <p className="section-label mb-3">Items</p>
          <ul className="space-y-3">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>
                  {item.name}
                  {(item.size || item.color) && (
                    <span className="text-grey"> ({[item.color, item.size].filter(Boolean).join(' / ')})</span>
                  )}
                  {' '}&times; {item.quantity}
                </span>
                <span className="text-gold">{formatNaira(item.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-grey-light pt-4 text-sm">
            <div className="flex justify-between"><span className="text-grey">Subtotal</span><span>{formatNaira(order.subtotal)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-status-success"><span>Discount</span><span>-{formatNaira(order.discount)}</span></div>
            )}
            <div className="flex justify-between"><span className="text-grey">Delivery</span><span>{order.deliveryFee ? formatNaira(order.deliveryFee) : 'Free'}</span></div>
            <div className="flex justify-between font-medium"><span>Total</span><span className="text-gold">{formatNaira(order.total)}</span></div>
          </div>
        </div>

        <div>
          <p className="section-label mb-3">Delivery Details</p>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-grey">{order.shippingAddress.phone}</p>
          <p className="mt-2 text-sm text-grey">
            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
          </p>
          {order.estimatedDeliveryDate && (
            <p className="mt-3 text-sm">
              Estimated delivery: <strong>{formatDate(order.estimatedDeliveryDate)}</strong>
            </p>
          )}
          {order.trackingNotes?.length > 0 && (
            <div className="mt-4">
              <p className="section-label mb-2">Tracking Notes</p>
              <ul className="space-y-2">
                {order.trackingNotes.map((note, i) => (
                  <li key={i} className="text-xs text-grey">
                    <span className="text-black">{formatDate(note.date)}:</span> {note.note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
