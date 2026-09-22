import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Star, Check, EyeOff } from 'lucide-react';
import { useAdminReviews, useSetReviewStatus } from '../../features/admin/hooks';
import { Badge, Button, Card, Skeleton } from '../../components/ui';
import { formatDate } from '../../lib/format';

const STATUS_VARIANT = { pending: 'warning', approved: 'success', hidden: 'outline' };

export default function Reviews() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data: reviews, isLoading } = useAdminReviews({ status: statusFilter || undefined });
  const { mutate: setStatus } = useSetReviewStatus();

  function handleStatus(id, status) {
    setStatus({ id, status }, { onSuccess: () => toast.success(`Review ${status}.`) });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Reviews</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 border border-grey-light bg-white px-3 text-sm focus:border-gold focus:outline-none">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
      ) : !reviews?.length ? (
        <p className="mt-6 text-sm text-grey">No reviews found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((r) => (
            <Card key={r._id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {r.product?.images?.[0]?.url && <img src={r.product.images[0].url} alt="" className="h-10 w-10 object-cover" />}
                  <div>
                    <Link to={`/product/${r.product?.slug}`} target="_blank" className="hover:text-gold">{r.product?.name}</Link>
                    <p className="text-xs text-grey">{r.user?.name} &middot; {formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>
              </div>
              <div className="mt-3 flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-gold' : ''}`} />)}
              </div>
              {r.title && <p className="mt-2 text-sm font-medium">{r.title}</p>}
              <p className="mt-1 text-sm text-grey">{r.comment}</p>
              <div className="mt-4 flex gap-3">
                {r.status !== 'approved' && (
                  <Button size="sm" onClick={() => handleStatus(r._id, 'approved')}><Check className="h-3.5 w-3.5" /> Approve</Button>
                )}
                {r.status !== 'hidden' && (
                  <Button size="sm" variant="outline" onClick={() => handleStatus(r._id, 'hidden')}><EyeOff className="h-3.5 w-3.5" /> Hide</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
