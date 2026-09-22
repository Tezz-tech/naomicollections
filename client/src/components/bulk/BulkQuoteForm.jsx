import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateBulkRequest } from '../../features/bulkRequests/hooks';
import { useAuthStore } from '../../store/authStore';
import { Button, Input } from '../ui';

const schema = z.object({
  name: z.string().trim().min(2, 'Required'),
  businessName: z.string().trim().optional(),
  phone: z.string().trim().min(7, 'Required'),
  email: z.string().trim().email('Enter a valid email'),
  deliveryLocation: z.string().trim().min(2, 'Required'),
  notes: z.string().trim().optional(),
  items: z
    .array(z.object({ name: z.string().trim().min(1, 'Required'), quantity: z.number().min(1) }))
    .min(1),
});

export default function BulkQuoteForm() {
  const { user } = useAuthStore();
  const { mutate, isPending, isSuccess } = useCreateBulkRequest();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      items: [{ name: '', quantity: 10 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  function onSubmit(values) {
    mutate(
      { ...values, items: values.items.map((i) => ({ ...i, quantity: Number(i.quantity) })) },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          reset();
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Could not submit request.'),
      }
    );
  }

  if (isSuccess) {
    return (
      <div className="border border-status-success/30 bg-status-success/5 p-8 text-center">
        <p className="font-serif text-xl">Request Received</p>
        <p className="mt-2 text-sm text-grey">We'll email your quote within 1-2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Your Name" {...register('name')} error={errors.name?.message} />
        <Input label="Business Name (optional)" {...register('businessName')} />
        <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Delivery Location" {...register('deliveryLocation')} error={errors.deliveryLocation?.message} containerClassName="sm:col-span-2" />
      </div>

      <div>
        <p className="section-label mb-3">Items</p>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-3">
              <Input placeholder="Item name" {...register(`items.${i}.name`)} error={errors.items?.[i]?.name?.message} containerClassName="flex-1" />
              <Input type="number" min={1} placeholder="Qty" {...register(`items.${i}.quantity`, { valueAsNumber: true })} containerClassName="w-28" />
              <button type="button" onClick={() => remove(i)} disabled={fields.length === 1} className="text-grey hover:text-status-error disabled:opacity-30">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ name: '', quantity: 10 })}
          className="link-underline mt-3 flex items-center gap-1.5 text-xs uppercase tracking-wide text-grey"
        >
          <Plus className="h-3.5 w-3.5" /> Add Item
        </button>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Notes (optional)</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full border border-grey-light px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <Button type="submit" size="lg" loading={isPending}>
        Request Quote
      </Button>
    </form>
  );
}
