import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminPayments } from '../../features/admin/hooks';
import { Badge, Skeleton } from '../../components/ui';
import Pagination from '../../components/shop/Pagination';
import { formatDate, formatNaira } from '../../lib/format';

const STATUS_VARIANT = { success: 'success', pending: 'warning', failed: 'error', abandoned: 'outline' };

export default function Payments() {
  const [filters, setFilters] = useState({ page: 1, status: '' });
  const { data, isLoading } = useAdminPayments(filters);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Payments</h1>
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))} className="h-11 border border-grey-light bg-white px-3 text-sm focus:border-gold focus:outline-none">
          <option value="">All Statuses</option>
          {Object.keys(STATUS_VARIANT).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto border border-grey-light">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-offwhite text-left text-xs uppercase tracking-wide text-grey">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-grey-light"><td className="px-4 py-3" colSpan={6}><Skeleton className="h-6 w-full" /></td></tr>
                ))
              : data?.payments?.map((p) => (
                  <tr key={p._id} className="border-t border-grey-light">
                    <td className="px-4 py-3 font-mono text-xs">{p.reference}</td>
                    <td className="px-4 py-3">
                      {p.order ? <Link to={`/admin/orders/${p.order._id}`} className="hover:text-gold">{p.order.orderNumber}</Link> : '—'}
                    </td>
                    <td className="px-4 py-3">{formatNaira(p.amount)}</td>
                    <td className="px-4 py-3 text-grey">{p.channel || '—'}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge></td>
                    <td className="px-4 py-3 text-grey">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Pagination page={data?.pagination?.page || 1} pages={data?.pagination?.pages || 1} onChange={(page) => setFilters((f) => ({ ...f, page }))} />
    </div>
  );
}
