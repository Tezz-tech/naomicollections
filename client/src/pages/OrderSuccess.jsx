import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { verifyPayment } from '../features/payments/api';
import { useCartStore } from '../store/cartStore';
import { Button, Divider, Skeleton } from '../components/ui';
import { formatNaira, formatDate } from '../lib/format';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const clear = useCartStore((s) => s.clear);

  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ['verify-payment', reference],
    queryFn: () => verifyPayment(reference),
    enabled: !!reference,
    retry: false,
  });

  useEffect(() => {
    if (order) clear();
  }, [order, clear]);

  if (!reference) {
    return (
      <div className="container-luxury py-32 text-center">
        <p className="font-serif text-2xl">No payment reference found</p>
        <Button as={Link} to="/shop" className="mt-6">Continue Shopping</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-luxury py-24">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto mt-4 h-64 max-w-md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-luxury flex flex-col items-center py-32 text-center">
        <XCircle className="h-12 w-12 text-status-error" />
        <p className="mt-4 font-serif text-2xl">Payment Verification Failed</p>
        <p className="mt-2 max-w-md text-sm text-grey">
          {error?.response?.data?.message || 'We could not confirm this payment. If you were charged, please contact support.'}
        </p>
        <Button as={Link} to="/cart" className="mt-6">Back to Bag</Button>
      </div>
    );
  }

  return (
    <div className="container-luxury flex flex-col items-center py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-status-success" />
        <Divider label="Payment Confirmed" className="mt-6" />
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl">Thank You, {order.shippingAddress?.fullName?.split(' ')[0]}</h1>
        <p className="mt-3 text-sm text-grey">
          Your order <strong className="text-black">{order.orderNumber}</strong> has been confirmed.
        </p>

        <div className="mx-auto mt-10 max-w-md border border-grey-light p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-grey">Order Number</span>
            <span>{order.orderNumber}</span>
          </div>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-grey">Total Paid</span>
            <span className="text-gold">{formatNaira(order.total)}</span>
          </div>
          {order.estimatedDeliveryDate && (
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-grey">Estimated Delivery</span>
              <span>{formatDate(order.estimatedDeliveryDate)}</span>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button as={Link} to={`/order/${order.orderNumber}`}>
            Track Order
          </Button>
          <Button as={Link} to="/shop" variant="secondary">
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
