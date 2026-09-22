import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAdminSettings, useUpdateSettings } from '../../features/admin/hooks';
import { Button, Card, Input, Skeleton } from '../../components/ui';

export default function Settings() {
  const { data: settings, isLoading } = useAdminSettings();
  const { mutate, isPending } = useUpdateSettings();
  const { register, handleSubmit } = useForm({ values: settings });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  function onSubmit(values) {
    mutate(
      {
        storeName: values.storeName,
        storeEmail: values.storeEmail,
        storePhone: values.storePhone,
        currency: values.currency,
        socialLinks: values.socialLinks,
      },
      { onSuccess: () => toast.success('Settings updated.') }
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl">Store Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-xl space-y-8">
        <Card className="p-6">
          <p className="section-label mb-4">Store Info</p>
          <div className="space-y-4">
            <Input label="Store Name" {...register('storeName')} />
            <Input label="Store Email" type="email" {...register('storeEmail')} />
            <Input label="Store Phone" {...register('storePhone')} />
            <Input label="Currency" {...register('currency')} disabled />
          </div>
        </Card>

        <Card className="p-6">
          <p className="section-label mb-4">Social Links</p>
          <div className="space-y-4">
            <Input label="Instagram" {...register('socialLinks.instagram')} />
            <Input label="Facebook" {...register('socialLinks.facebook')} />
            <Input label="Twitter / X" {...register('socialLinks.twitter')} />
            <Input label="WhatsApp Link" {...register('socialLinks.whatsapp')} />
          </div>
        </Card>

        <Button type="submit" loading={isPending}>Save Settings</Button>
      </form>
    </div>
  );
}
