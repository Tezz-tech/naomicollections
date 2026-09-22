import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Tag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useQuoteMutation, useCreateOrder } from '../features/orders/hooks';
import { initializePayment } from '../features/payments/api';
import { NIGERIAN_STATES } from '../data/nigerianStates';
import { Button, Divider, Input } from '../components/ui';
import OrderSummary from '../components/checkout/OrderSummary';

const schema = z.object({
  guestName: z.string().optional(),
  guestEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  guestPhone: z.string().optional(),
  fullName: z.string().min(2, 'Required'),
  phone: z.string().min(7, 'Required'),
  state: z.string().min(1, 'Select a state'),
  city: z.string().min(2, 'Required'),
  lga: z.string().optional(),
  street: z.string().min(4, 'Required'),
  landmark: z.string().optional(),
  couponCode: z.string().optional(),
});

function toQuoteItems(items) {
  return items.map((i) => ({ productId: i.productId, variantSku: i.variantSku || undefined, quantity: i.quantity }));
}

export default function Checkout() {
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const [quote, setQuote] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const { mutate: fetchQuote, isPending: isQuoting } = useQuoteMutation();
  const { mutateAsync: submitOrder, isPending: isCreatingOrder } = useCreateOrder();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: user?.name || '', phone: user?.phone || '' },
  });

  const state = watch('state');
  const city = watch('city');

  useEffect(() => {
    if (!state || items.length === 0) return;
    const timeout = setTimeout(() => {
      fetchQuote(
        { items: toQuoteItems(items), state, city, couponCode: appliedCoupon || undefined },
        { onSuccess: setQuote, onError: () => setQuote(null) }
      );
    }, 400);
    return () => clearTimeout(timeout);
  }, [state, city, appliedCoupon, items, fetchQuote]);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  function applyCoupon() {
    const code = document.getElementById('coupon-input').value.trim();
    if (!code) return;
    setAppliedCoupon(code);
  }

  async function onSubmit(values) {
    try {
      const order = await submitOrder({
        items: toQuoteItems(items),
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          state: values.state,
          city: values.city,
          lga: values.lga,
          street: values.street,
          landmark: values.landmark,
        },
        couponCode: appliedCoupon || undefined,
        guestInfo: user
          ? undefined
          : { name: values.guestName || values.fullName, email: values.guestEmail, phone: values.guestPhone || values.phone },
      });

      setIsRedirecting(true);
      const { authorizationUrl } = await initializePayment({
        orderId: order._id,
        email: user?.email || values.guestEmail,
      });
      window.location.href = authorizationUrl;
    } catch (err) {
      setIsRedirecting(false);
      toast.error(err.response?.data?.message || 'Could not process checkout. Please try again.');
    }
  }

  return (
    <div className="container-luxury py-12">
      <Divider label="Secure Checkout" />
      <h1 className="mt-4 text-center font-serif text-3xl">Checkout</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-10">
          {!user && (
            <section>
              <p className="section-label mb-4">Contact Information</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full Name" {...register('guestName')} placeholder="Jane Doe" />
                <Input label="Email" type="email" {...register('guestEmail')} error={errors.guestEmail?.message} placeholder="you@example.com" />
              </div>
              <p className="mt-3 text-xs text-grey">
                Already have an account?{' '}
                <Link to="/login" state={{ from: '/checkout' }} className="link-underline text-black">
                  Log in
                </Link>{' '}
                for faster checkout.
              </p>
            </section>
          )}

          <section>
            <p className="section-label mb-4">Delivery Address</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
              <Input label="Phone Number" {...register('phone')} error={errors.phone?.message} />

              <div className="w-full">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">State</label>
                <select
                  {...register('state')}
                  className="h-11 w-full border border-grey-light bg-white px-3.5 text-sm focus:border-gold focus:outline-none"
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="mt-1.5 text-xs text-status-error">{errors.state.message}</p>}
              </div>

              <Input label="City" {...register('city')} error={errors.city?.message} />
              <Input label="LGA (optional)" {...register('lga')} />
              <Input label="Street Address" {...register('street')} error={errors.street?.message} containerClassName="sm:col-span-2" />
              <Input label="Landmark (optional)" {...register('landmark')} containerClassName="sm:col-span-2" />
            </div>
          </section>

          <section>
            <p className="section-label mb-4">Coupon Code</p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey" />
                <input
                  id="coupon-input"
                  placeholder="Enter code"
                  className="h-11 w-full border border-grey-light pl-10 pr-3 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <Button type="button" variant="secondary" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
            {appliedCoupon && (
              <p className="mt-2 text-xs text-status-success">
                {quote ? `"${appliedCoupon}" applied` : 'Checking coupon...'}
              </p>
            )}
          </section>

          <Button type="submit" size="lg" fullWidth loading={isCreatingOrder || isRedirecting}>
            Pay with Paystack
          </Button>
        </div>

        <OrderSummary items={items} quote={quote} isQuoting={isQuoting} />
      </form>
    </div>
  );
}
