import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  useAdminBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  useAdminSettings,
  useUpdateSettings,
} from '../../features/admin/hooks';
import { Badge, Button, Card, Input, Modal } from '../../components/ui';
import ImageUploader from '../components/ImageUploader';

function BannerForm({ defaultValues, onSubmit, isPending }) {
  const [image, setImage] = useState(defaultValues?.image ? [defaultValues.image] : []);
  const { register, handleSubmit } = useForm({ defaultValues });

  function submit(values) {
    if (!image[0]) return toast.error('Add a banner image.');
    onSubmit({ ...values, image: image[0], sortOrder: Number(values.sortOrder) || 0 });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Input label="Title" {...register('title', { required: true })} />
      <Input label="Subtitle" {...register('subtitle')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="CTA Text" {...register('ctaText')} placeholder="Shop Now" />
        <Input label="CTA Link" {...register('ctaLink')} placeholder="/shop" />
      </div>
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Image</label>
        <ImageUploader images={image} onChange={setImage} folder="banners" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Position</label>
          <select {...register('position')} className="h-11 w-full border border-grey-light bg-white px-3 text-sm focus:border-gold focus:outline-none">
            <option value="hero">Hero</option>
            <option value="category">Category</option>
            <option value="promo">Promo</option>
          </select>
        </div>
        <Input label="Sort Order" type="number" {...register('sortOrder')} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('isActive')} defaultChecked className="h-4 w-4 accent-gold" /> Active
      </label>
      <Button type="submit" loading={isPending}>Save Banner</Button>
    </form>
  );
}

export default function Content() {
  const { data: banners = [], isLoading } = useAdminBanners();
  const [modalState, setModalState] = useState(null);
  const { mutate: create, isPending: creating } = useCreateBanner();
  const { mutate: update, isPending: updating } = useUpdateBanner();
  const { mutate: remove } = useDeleteBanner();

  const { data: settings } = useAdminSettings();
  const { mutate: updateSettings, isPending: savingBar } = useUpdateSettings();
  const { register, handleSubmit } = useForm();

  function handleBannerSubmit(values) {
    const onSuccess = () => { toast.success('Saved.'); setModalState(null); };
    const onError = (err) => toast.error(err.response?.data?.message || 'Could not save banner.');
    if (modalState === 'add') create(values, { onSuccess, onError });
    else update({ id: modalState._id, payload: values }, { onSuccess, onError });
  }

  function onAnnouncementSubmit(values) {
    updateSettings(
      { announcementBar: { text: values.text, link: values.link, isActive: values.isActive } },
      { onSuccess: () => toast.success('Announcement bar updated.') }
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl">Content</h1>
      </div>

      <Card className="p-6">
        <p className="section-label mb-4">Announcement Bar</p>
        {settings && (
          <form onSubmit={handleSubmit(onAnnouncementSubmit)} className="space-y-4">
            <Input label="Text" defaultValue={settings.announcementBar?.text} {...register('text')} placeholder="Free delivery in Lagos on orders above ₦100,000" />
            <Input label="Link (optional)" defaultValue={settings.announcementBar?.link} {...register('link')} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked={settings.announcementBar?.isActive} {...register('isActive')} className="h-4 w-4 accent-gold" /> Show on site
            </label>
            <Button type="submit" loading={savingBar}>Save</Button>
          </form>
        )}
      </Card>

      <div>
        <div className="flex items-center justify-between">
          <p className="section-label">Hero Banners</p>
          <Button size="sm" onClick={() => setModalState('add')}><Plus className="h-3.5 w-3.5" /> New Banner</Button>
        </div>

        {isLoading ? (
          <p className="mt-4 text-sm text-grey">Loading...</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((b) => (
              <Card key={b._id} className="overflow-hidden">
                <div className="aspect-video bg-offwhite">
                  {b.image?.url && <img src={b.image.url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-xs text-grey">{b.position} &middot; order {b.sortOrder}</p>
                    </div>
                    <Badge variant={b.isActive ? 'success' : 'outline'}>{b.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button onClick={() => setModalState(b)}><Pencil className="h-4 w-4 text-grey hover:text-black" /></button>
                    <button onClick={() => remove(b._id)}><Trash2 className="h-4 w-4 text-grey hover:text-status-error" /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!modalState} onClose={() => setModalState(null)} title={modalState === 'add' ? 'New Banner' : 'Edit Banner'} size="lg">
        <BannerForm
          defaultValues={modalState === 'add' ? { position: 'hero', isActive: true, sortOrder: 0 } : modalState}
          onSubmit={handleBannerSubmit}
          isPending={creating || updating}
        />
      </Modal>
    </div>
  );
}
