import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Printer } from 'lucide-react';
import {
  useAdminOrder,
  useUpdateOrderStatus,
  useUpdateEstimatedDelivery,
  useAddTrackingNote,
} from '../../../features/admin/hooks';
import OrderTimeline from '../../../components/account/OrderTimeline';
import { Badge, Button, Card, Skeleton } from '../../../components/ui';
import { formatDate, formatNaira } from '../../../lib/format';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading } = useAdminOrder(id);
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateOrderStatus();
  const { mutate: updateDelivery } = useUpdateEstimatedDelivery();
  const { mutate: addNote, isPending: addingNote } = useAddTrackingNote();
  const [note, setNote] = useState('');
  const { register: registerStatus, handleSubmit: handleStatusSubmit, watch } = useForm();
  const selectedStatus = watch('status');

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!order) return <p className="text-sm text-grey">Order not found.</p>;

  function onStatusSubmit(values) {
    updateStatus(
      { id, status: values.status, note: values.statusNote },
      {
        onSuccess: () => toast.success('Order status updated — customer notified by email.'),
        onError: (err) => toast.error(err.response?.data?.message || 'Could not update status.'),
      }
    );
  }

  function onDeliveryDateChange(e) {
    if (!e.target.value) return;
    updateDelivery(
      { id, date: new Date(e.target.value).toISOString() },
      { onSuccess: () => toast.success('Delivery date updated.') }
    );
  }

  function submitNote(e) {
    e.preventDefault();
    if (!note.trim()) return;
    addNote({ id, note }, { onSuccess: () => { setNote(''); toast.success('Note added.'); } });
  }

  return (
    <div>
      <div className="no-print flex items-center justify-between">
        <div>
          <Link to="/admin/orders" className="link-underline flex items-center gap-1.5 text-xs uppercase tracking-wide text-grey">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
          </Link>
          <h1 className="mt-3 font-serif text-2xl">{order.orderNumber}</h1>
        </div>
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print Invoice
        </Button>
      </div>

      <div id="invoice" className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between print:justify-start print:gap-6">
              <div>
                <p className="section-label">Invoice</p>
                <p className="mt-1 font-serif text-xl">{order.orderNumber}</p>
                <p className="text-xs text-grey">{formatDate(order.createdAt)}</p>
              </div>
              <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>{order.paymentStatus}</Badge>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-grey">Bill / Ship To</p>
                <p className="mt-1">{order.shippingAddress.fullName}</p>
                <p className="text-grey">{order.shippingAddress.phone}</p>
                <p className="text-grey">{order.user?.email || order.guestInfo?.email}</p>
                <p className="mt-1 text-grey">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}</p>
              </div>
            </div>

            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="border-b border-grey-light text-left text-xs uppercase tracking-wide text-grey">
                  <th className="py-2">Item</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2 text-right">Unit</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-grey-light">
                    <td className="py-2.5">{item.name}{(item.size || item.color) && <span className="text-grey"> ({[item.color, item.size].filter(Boolean).join(' / ')})</span>}</td>
                    <td className="py-2.5">{item.quantity}</td>
                    <td className="py-2.5 text-right">{formatNaira(item.unitPrice)}</td>
                    <td className="py-2.5 text-right">{formatNaira(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ml-auto mt-4 max-w-xs space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-grey">Subtotal</span><span>{formatNaira(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-status-success"><span>Discount</span><span>-{formatNaira(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-grey">Delivery</span><span>{order.deliveryFee ? formatNaira(order.deliveryFee) : 'Free'}</span></div>
              <div className="flex justify-between border-t border-grey-light pt-1.5 font-medium"><span>Total</span><span>{formatNaira(order.total)}</span></div>
            </div>
          </Card>

          <Card className="no-print p-6">
            <p className="section-label mb-4">Order Timeline</p>
            <OrderTimeline status={order.status} statusHistory={order.statusHistory} />
          </Card>
        </div>

        <div className="no-print space-y-6">
          <Card className="p-6">
            <p className="section-label mb-3">Update Status</p>
            <form onSubmit={handleStatusSubmit(onStatusSubmit)} className="space-y-3">
              <select {...registerStatus('status')} defaultValue={order.status} className="h-11 w-full border border-grey-light bg-white px-3 text-sm focus:border-gold focus:outline-none">
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
              <textarea {...registerStatus('statusNote')} placeholder="Note for customer (optional)" rows={2} className="w-full border border-grey-light px-3 py-2 text-sm focus:border-gold focus:outline-none" />
              <Button type="submit" fullWidth loading={updatingStatus} disabled={selectedStatus === order.status && !watch('statusNote')}>
                Update Status
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <p className="section-label mb-3">Estimated Delivery Date</p>
            <input
              type="date"
              defaultValue={order.estimatedDeliveryDate ? order.estimatedDeliveryDate.slice(0, 10) : ''}
              onChange={onDeliveryDateChange}
              className="h-11 w-full border border-grey-light px-3 text-sm focus:border-gold focus:outline-none"
            />
          </Card>

          <Card className="p-6">
            <p className="section-label mb-3">Internal Tracking Notes</p>
            <ul className="mb-3 space-y-2">
              {order.trackingNotes?.map((n, i) => (
                <li key={i} className="text-xs text-grey"><span className="text-black">{formatDate(n.date)}:</span> {n.note}</li>
              ))}
              {!order.trackingNotes?.length && <p className="text-xs text-grey">No notes yet.</p>}
            </ul>
            <form onSubmit={submitNote} className="flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="h-10 flex-1 border border-grey-light px-3 text-sm focus:border-gold focus:outline-none" />
              <Button type="submit" size="sm" loading={addingNote}>Add</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
