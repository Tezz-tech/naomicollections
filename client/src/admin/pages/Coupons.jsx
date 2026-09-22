import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  useCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from '../../features/admin/hooks';
import { Badge, Button, Card, Input, Modal } from '../../components/ui';
import { formatDate, formatNaira } from '../../lib/format';

function CouponForm({ defaultValues, onSubmit, isPending }) {
  const { register, handleSubmit } = useForm({ defaultValues });
  return (
    <form
      onSubmit={handleSubmit((v) =>
        onSubmit({
          code: v.code,
          type: v.type,
          value: Number(v.value),
          minSpend: Number(v.minSpend) || 0,
          usageLimit: v.usageLimit ? Number(v.usageLimit) : null,
          expiresAt: v.expiresAt || undefined,
          isActive: v.isActive,
        })
      )}
      className="space-y-4"
    >
      <Input label="Code" {...register('code', { required: true })} placeholder="WELCOME10" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Type</label>
          <select {...register('type')} className="h-11 w-full border border-grey-light bg-white px-3 text-sm focus:border-gold focus:outline-none">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <Input label="Value" type="number" {...register('value', { required: true })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Min Spend (₦)" type="number" {...register('minSpend')} />
        <Input label="Usage Limit (blank = unlimited)" type="number" {...register('usageLimit')} />
      </div>
      <Input label="Expiry Date (optional)" type="date" {...register('expiresAt')} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('isActive')} defaultChecked className="h-4 w-4 accent-gold" /> Active
      </label>
      <Button type="submit" loading={isPending}>Save Coupon</Button>
    </form>
  );
}

export default function Coupons() {
  const { data: coupons = [], isLoading } = useCoupons();
  const [modalState, setModalState] = useState(null);
  const { mutate: create, isPending: creating } = useCreateCoupon();
  const { mutate: update, isPending: updating } = useUpdateCoupon();
  const { mutate: remove } = useDeleteCoupon();

  function handleSubmit(values) {
    const onSuccess = () => { toast.success('Saved.'); setModalState(null); };
    const onError = (err) => toast.error(err.response?.data?.message || 'Could not save coupon.');
    if (modalState === 'add') create(values, { onSuccess, onError });
    else update({ id: modalState._id, payload: values }, { onSuccess, onError });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Coupons</h1>
        <Button onClick={() => setModalState('add')}><Plus className="h-4 w-4" /> New Coupon</Button>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-grey">Loading...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <Card key={c._id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-lg">{c.code}</p>
                  <p className="text-xs text-grey">
                    {c.type === 'percentage' ? `${c.value}% off` : `${formatNaira(c.value)} off`}
                    {c.minSpend > 0 && ` · Min ${formatNaira(c.minSpend)}`}
                  </p>
                </div>
                <Badge variant={c.isActive ? 'success' : 'outline'}>{c.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className="mt-2 text-xs text-grey">
                Used {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}
                {c.expiresAt && ` · Expires ${formatDate(c.expiresAt)}`}
              </p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => setModalState(c)}><Pencil className="h-4 w-4 text-grey hover:text-black" /></button>
                <button onClick={() => remove(c._id)}><Trash2 className="h-4 w-4 text-grey hover:text-status-error" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!modalState} onClose={() => setModalState(null)} title={modalState === 'add' ? 'New Coupon' : 'Edit Coupon'}>
        <CouponForm
          defaultValues={modalState === 'add' ? { type: 'percentage', isActive: true } : modalState}
          onSubmit={handleSubmit}
          isPending={creating || updating}
        />
      </Modal>
    </div>
  );
}
