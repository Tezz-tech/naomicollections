import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import {
  useAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
} from '../../features/admin/hooks';
import { Badge, Button, Card, Input, Modal } from '../../components/ui';

function CreateAdminForm({ permissions, onSubmit, isPending }) {
  const { register, handleSubmit, watch } = useForm({ defaultValues: { permissions: [] } });
  const selected = watch('permissions') || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name" {...register('name', { required: true })} />
      <Input label="Email" type="email" {...register('email', { required: true })} />
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Permissions</label>
        <div className="flex flex-wrap gap-2">
          {permissions?.map((perm) => (
            <label key={perm} className={`cursor-pointer border px-2.5 py-1.5 text-xs capitalize ${selected.includes(perm) ? 'border-black bg-black text-white' : 'border-grey-light'}`}>
              <input type="checkbox" value={perm} {...register('permissions')} className="hidden" />
              {perm}
            </label>
          ))}
        </div>
      </div>
      <Button type="submit" loading={isPending}>Create Admin</Button>
    </form>
  );
}

export default function Admins() {
  const { data, isLoading } = useAdmins();
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate: create, isPending: creating } = useCreateAdmin();
  const { mutate: update } = useUpdateAdmin();
  const { mutate: remove } = useDeleteAdmin();

  function handleCreate(values) {
    create(values, {
      onSuccess: (res) => {
        toast.success(`Admin created. Temporary password: ${res.tempPassword} (also emailed to them)`, { duration: 8000 });
        setModalOpen(false);
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Could not create admin.'),
    });
  }

  function togglePermission(admin, perm) {
    const has = admin.permissions.includes(perm);
    const permissions = has ? admin.permissions.filter((p) => p !== perm) : [...admin.permissions, perm];
    update({ id: admin._id, payload: { permissions } });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Admins & Roles</h1>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Admin</Button>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-grey">Loading...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {data?.admins?.map((admin) => (
            <Card key={admin._id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-lg">{admin.name}</p>
                  <p className="text-xs text-grey">{admin.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={admin.role === 'super-admin' ? 'gold' : 'outline'}>{admin.role}</Badge>
                  {admin.role === 'admin' && (
                    <button onClick={() => remove(admin._id)}><Trash2 className="h-4 w-4 text-grey hover:text-status-error" /></button>
                  )}
                </div>
              </div>

              {admin.role === 'admin' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.availablePermissions.map((perm) => (
                    <button
                      key={perm}
                      onClick={() => togglePermission(admin, perm)}
                      className={`border px-2.5 py-1 text-xs capitalize transition-colors ${admin.permissions.includes(perm) ? 'border-black bg-black text-white' : 'border-grey-light text-grey hover:border-black'}`}
                    >
                      {perm}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Admin">
        <CreateAdminForm permissions={data?.availablePermissions} onSubmit={handleCreate} isPending={creating} />
      </Modal>
    </div>
  );
}
