import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useUpdateProfile } from '../../features/users/hooks';
import { useMyOrders } from '../../features/orders/hooks';
import { Button, Card, Input } from '../../components/ui';
import { formatDate, formatNaira } from '../../lib/format';

export default function AccountOverview() {
  const { user } = useAuthStore();
  const { data: orders } = useMyOrders();
  const { mutate, isPending } = useUpdateProfile();
  const {
    register,
    handleSubmit,
  } = useForm({ defaultValues: { name: user?.name, phone: user?.phone || '' } });

  function onSubmit(values) {
    mutate(values, {
      onSuccess: () => toast.success('Profile updated.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Could not update profile.'),
    });
  }

  const recentOrder = orders?.[0];

  return (
    <div className="space-y-10">
      <Card className="p-6">
        <p className="section-label mb-4">Profile</p>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full Name" {...register('name')} />
          <Input label="Phone" {...register('phone')} />
          <Input label="Email" value={user?.email} disabled containerClassName="sm:col-span-2" />
          <div className="sm:col-span-2">
            <Button type="submit" loading={isPending}>Save Changes</Button>
          </div>
        </form>
        {!user?.isVerified && (
          <p className="mt-4 text-xs text-status-warning">
            Your email is not verified yet — check your inbox for the verification link.
          </p>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="section-label">Most Recent Order</p>
          <Link to="/account/orders" className="link-underline text-xs text-grey">View all</Link>
        </div>
        {recentOrder ? (
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-lg">{recentOrder.orderNumber}</p>
              <p className="text-xs text-grey">{formatDate(recentOrder.createdAt)} &middot; {recentOrder.status}</p>
            </div>
            <span className="text-gold">{formatNaira(recentOrder.total)}</span>
          </div>
        ) : (
          <p className="mt-4 text-sm text-grey">No orders yet.</p>
        )}
      </Card>
    </div>
  );
}
