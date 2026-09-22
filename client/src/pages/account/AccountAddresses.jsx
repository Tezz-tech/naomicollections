import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAddAddress, useUpdateAddress, useDeleteAddress } from '../../features/users/hooks';
import { addressSchema } from '../../lib/schemas';
import { NIGERIAN_STATES } from '../../data/nigerianStates';
import { Button, Card, Input, Modal } from '../../components/ui';

function AddressForm({ defaultValues, onSubmit, isPending }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addressSchema), defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="Label" {...register('label')} placeholder="Home, Office..." />
      <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
      <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">State</label>
        <select {...register('state')} className="h-11 w-full border border-grey-light bg-white px-3.5 text-sm focus:border-gold focus:outline-none">
          <option value="">Select state</option>
          {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.state && <p className="mt-1.5 text-xs text-status-error">{errors.state.message}</p>}
      </div>
      <Input label="City" {...register('city')} error={errors.city?.message} />
      <Input label="LGA (optional)" {...register('lga')} />
      <Input label="Street Address" {...register('street')} error={errors.street?.message} containerClassName="sm:col-span-2" />
      <Input label="Landmark (optional)" {...register('landmark')} containerClassName="sm:col-span-2" />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" {...register('isDefault')} className="h-4 w-4 accent-gold" />
        Set as default address
      </label>
      <Button type="submit" loading={isPending} className="sm:col-span-2">Save Address</Button>
    </form>
  );
}

export default function AccountAddresses() {
  const { user } = useAuthStore();
  const [modalState, setModalState] = useState(null); // null | 'add' | address object

  const { mutate: add, isPending: adding } = useAddAddress();
  const { mutate: update, isPending: updating } = useUpdateAddress();
  const { mutate: remove } = useDeleteAddress();

  function handleSubmit(values) {
    const action = modalState === 'add'
      ? add(values, { onSuccess: () => { toast.success('Address added.'); setModalState(null); } })
      : update({ addressId: modalState._id, payload: values }, { onSuccess: () => { toast.success('Address updated.'); setModalState(null); } });
    return action;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="section-label">Saved Addresses</p>
        <Button size="sm" variant="secondary" onClick={() => setModalState('add')}>
          <Plus className="h-3.5 w-3.5" /> Add Address
        </Button>
      </div>

      {!user?.addresses?.length ? (
        <p className="mt-6 text-sm text-grey">No saved addresses yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {user.addresses.map((addr) => (
            <Card key={addr._id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    {addr.label || 'Address'}
                    {addr.isDefault && <Star className="h-3.5 w-3.5 fill-gold text-gold" />}
                  </p>
                  <p className="mt-1 text-sm text-grey">{addr.fullName} &middot; {addr.phone}</p>
                  <p className="mt-1 text-sm text-grey">{addr.street}, {addr.city}, {addr.state}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModalState(addr)} aria-label="Edit"><Pencil className="h-4 w-4 text-grey hover:text-black" /></button>
                  <button onClick={() => remove(addr._id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-grey hover:text-status-error" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!modalState}
        onClose={() => setModalState(null)}
        title={modalState === 'add' ? 'Add Address' : 'Edit Address'}
        size="lg"
      >
        <AddressForm
          defaultValues={modalState === 'add' ? {} : modalState}
          onSubmit={handleSubmit}
          isPending={adding || updating}
        />
      </Modal>
    </div>
  );
}
