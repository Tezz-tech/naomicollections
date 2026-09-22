import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../../features/categories/hooks';
import { Button, Card, Input, Modal } from '../../components/ui';
import ImageUploader from '../components/ImageUploader';

function CategoryForm({ defaultValues, onSubmit, isPending }) {
  const [image, setImage] = useState(defaultValues?.image ? [defaultValues.image] : []);
  const { register, handleSubmit } = useForm({ defaultValues });

  function submit(values) {
    onSubmit({ ...values, image: image[0] || undefined });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Input label="Name" {...register('name', { required: true })} />
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Description</label>
        <textarea {...register('description')} rows={3} className="w-full border border-grey-light px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" />
      </div>
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Image</label>
        <ImageUploader images={image} onChange={setImage} folder="categories" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('isActive')} defaultChecked className="h-4 w-4 accent-gold" /> Active
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('showInMenu')} defaultChecked className="h-4 w-4 accent-gold" /> Show in navigation menu
      </label>
      <Button type="submit" loading={isPending}>Save Category</Button>
    </form>
  );
}

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories(true);
  const [modalState, setModalState] = useState(null);
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: update, isPending: updating } = useUpdateCategory();
  const { mutate: remove } = useDeleteCategory();

  function handleSubmit(values) {
    const onSuccess = () => { toast.success('Saved.'); setModalState(null); };
    const onError = (err) => toast.error(err.response?.data?.message || 'Could not save category.');
    if (modalState === 'add') create(values, { onSuccess, onError });
    else update({ id: modalState._id, payload: values }, { onSuccess, onError });
  }

  function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    remove(id, {
      onSuccess: () => toast.success('Category deleted.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Could not delete category.'),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Categories</h1>
        <Button onClick={() => setModalState('add')}><Plus className="h-4 w-4" /> New Category</Button>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-grey">Loading...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat._id} className="overflow-hidden">
              <div className="aspect-[3/2] bg-offwhite">
                {cat.image?.url && <img src={cat.image.url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-serif text-lg">{cat.name}</p>
                    <p className="text-xs text-grey">{cat.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setModalState(cat)}><Pencil className="h-4 w-4 text-grey hover:text-black" /></button>
                    <button onClick={() => handleDelete(cat._id, cat.name)}><Trash2 className="h-4 w-4 text-grey hover:text-status-error" /></button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!modalState} onClose={() => setModalState(null)} title={modalState === 'add' ? 'New Category' : 'Edit Category'}>
        <CategoryForm
          defaultValues={modalState === 'add' ? { isActive: true, showInMenu: true } : modalState}
          onSubmit={handleSubmit}
          isPending={creating || updating}
        />
      </Modal>
    </div>
  );
}
