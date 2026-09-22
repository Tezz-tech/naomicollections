import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { useAdminZones, useUpsertZone, useAdminSettings, useUpdateSettings } from '../../features/admin/hooks';
import { Button, Card, Input, Modal } from '../../components/ui';
import { formatNaira } from '../../lib/format';

function ZoneForm({ zone, onSubmit, isPending }) {
  const { register, handleSubmit } = useForm({ defaultValues: zone });
  return (
    <form
      onSubmit={handleSubmit((v) =>
        onSubmit({
          state: zone.state,
          fee: Number(v.fee),
          minDays: Number(v.minDays),
          maxDays: Number(v.maxDays),
          isActive: v.isActive,
        })
      )}
      className="space-y-4"
    >
      <p className="font-serif text-lg">{zone.state}</p>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Fee (₦)" type="number" {...register('fee', { required: true })} />
        <div />
        <Input label="Min Days" type="number" {...register('minDays', { required: true })} />
        <Input label="Max Days" type="number" {...register('maxDays', { required: true })} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('isActive')} defaultChecked className="h-4 w-4 accent-gold" /> Active
      </label>
      <Button type="submit" loading={isPending}>Save Zone</Button>
    </form>
  );
}

export default function DeliveryZones() {
  const { data: zones = [], isLoading } = useAdminZones();
  const { data: settings } = useAdminSettings();
  const { mutate: upsert, isPending } = useUpsertZone();
  const { mutate: updateSettings, isPending: savingThreshold } = useUpdateSettings();
  const [editing, setEditing] = useState(null);
  const [threshold, setThreshold] = useState(settings?.freeDeliveryThreshold);

  function handleSubmit(values) {
    upsert(values, {
      onSuccess: () => { toast.success('Zone updated.'); setEditing(null); },
      onError: (err) => toast.error(err.response?.data?.message || 'Could not save zone.'),
    });
  }

  function saveThreshold() {
    updateSettings(
      { freeDeliveryThreshold: Number(threshold) },
      { onSuccess: () => toast.success('Free delivery threshold updated.') }
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl">Delivery Zones</h1>

      <Card className="mt-6 p-6">
        <p className="section-label mb-3">Free Delivery Threshold</p>
        <div className="flex max-w-sm gap-3">
          <Input type="number" defaultValue={settings?.freeDeliveryThreshold} onChange={(e) => setThreshold(e.target.value)} containerClassName="flex-1" />
          <Button onClick={saveThreshold} loading={savingThreshold}>Save</Button>
        </div>
        <p className="mt-2 text-xs text-grey">Orders at or above this subtotal get free delivery.</p>
      </Card>

      <div className="mt-6 overflow-x-auto border border-grey-light">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-offwhite text-left text-xs uppercase tracking-wide text-grey">
            <tr>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Timeline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!isLoading && zones.map((zone) => (
              <tr key={zone._id} className="border-t border-grey-light">
                <td className="px-4 py-3">{zone.state}</td>
                <td className="px-4 py-3">{formatNaira(zone.fee)}</td>
                <td className="px-4 py-3 text-grey">{zone.minDays}-{zone.maxDays} days</td>
                <td className="px-4 py-3 text-grey">{zone.isActive ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setEditing(zone)}><Pencil className="h-4 w-4 text-grey hover:text-black" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Delivery Zone">
        {editing && <ZoneForm zone={editing} onSubmit={handleSubmit} isPending={isPending} />}
      </Modal>
    </div>
  );
}
