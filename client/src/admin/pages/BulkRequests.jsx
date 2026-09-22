import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Badge, Button, Card, Input, Modal } from '../../components/ui';
import {
  useAdminBulkRequests,
  useRespondToBulkRequest,
  useCloseBulkRequest,
} from '../../features/admin/hooks';
import { formatDate, formatNaira } from '../../lib/format';

const STATUS_VARIANT = { new: 'gold', quoted: 'black', converted: 'success', closed: 'outline' };

function QuoteForm({ onSubmit, isPending }) {
  const { register, handleSubmit } = useForm();
  return (
    <form onSubmit={handleSubmit((v) => onSubmit({ amount: Number(v.amount), notes: v.notes }))} className="space-y-4">
      <Input label="Quote Amount (₦)" type="number" {...register('amount', { required: true })} />
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Notes</label>
        <textarea {...register('notes')} rows={3} className="w-full border border-grey-light px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" />
      </div>
      <Button type="submit" loading={isPending}>Send Quote</Button>
    </form>
  );
}

export default function BulkRequests() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data: requests, isLoading } = useAdminBulkRequests({ status: statusFilter || undefined });
  const [quoteModal, setQuoteModal] = useState(null);
  const { mutate: respond, isPending: responding } = useRespondToBulkRequest();
  const { mutate: close } = useCloseBulkRequest();

  function handleQuote(values) {
    respond(
      { id: quoteModal._id, ...values },
      {
        onSuccess: () => { toast.success('Quote sent.'); setQuoteModal(null); },
        onError: (err) => toast.error(err.response?.data?.message || 'Could not send quote.'),
      }
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Bulk Quote Requests</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 border border-grey-light bg-white px-3 text-sm focus:border-gold focus:outline-none">
          <option value="">All</option>
          {Object.keys(STATUS_VARIANT).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-grey">Loading...</p>
      ) : !requests?.length ? (
        <p className="mt-6 text-sm text-grey">No requests yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {requests.map((req) => (
            <Card key={req._id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-lg">{req.name} {req.businessName && <span className="text-grey">— {req.businessName}</span>}</p>
                  <p className="text-xs text-grey">{req.email} &middot; {req.phone} &middot; {formatDate(req.createdAt)}</p>
                </div>
                <Badge variant={STATUS_VARIANT[req.status]}>{req.status}</Badge>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-grey">
                {req.items.map((item, i) => <li key={i}>{item.name} &times; {item.quantity}</li>)}
              </ul>
              <p className="mt-2 text-xs text-grey">Delivering to: {req.deliveryLocation}</p>
              {req.notes && <p className="mt-1 text-xs text-grey">Note: {req.notes}</p>}

              {req.quote?.amount && (
                <p className="mt-3 text-sm">Quoted: <span className="text-gold">{formatNaira(req.quote.amount)}</span></p>
              )}

              {req.status === 'new' && (
                <div className="mt-4 flex gap-3">
                  <Button size="sm" onClick={() => setQuoteModal(req)}>Send Quote</Button>
                  <Button size="sm" variant="outline" onClick={() => close(req._id)}>Close</Button>
                </div>
              )}
              {req.status === 'quoted' && (
                <div className="mt-4">
                  <Button size="sm" variant="outline" onClick={() => close(req._id)}>Close Request</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!quoteModal} onClose={() => setQuoteModal(null)} title="Send Quote">
        <QuoteForm onSubmit={handleQuote} isPending={responding} />
      </Modal>
    </div>
  );
}
