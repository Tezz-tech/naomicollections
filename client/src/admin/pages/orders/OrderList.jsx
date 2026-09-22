import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAdminOrders } from '../../../features/admin/hooks';
import { Badge, Input, Skeleton } from '../../../components/ui';
import Pagination from '../../../components/shop/Pagination';
import { formatDate, formatNaira } from '../../../lib/format';

const STATUS_VARIANT = {
  pending: 'warning', confirmed: 'gold', processing: 'gold',
  shipped: 'black', out_for_delivery: 'black', delivered: 'success', cancelled: 'error',
};

export default function OrderList() {
  const [filters, setFilters] = useState({ page: 1, search: '', status: '' });
  const { data, isLoading } = useAdminOrders(filters);

  return (
    <div>
      <h1 className="font-serif text-2xl">Orders</h1>
      <p className="mt-1 text-sm text-grey">{data?.pagination?.total ?? 0} total</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey" />
          <Input placeholder="Order #, name, phone, email..." className="pl-9" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))} />
        </div>
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))} className="h-11 border border-grey-light bg-white px-3 text-sm focus:border-gold focus:outline-none">
          <option value="">All Statuses</option>
          {Object.keys(STATUS_VARIANT).map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto border border-grey-light">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-offwhite text-left text-xs uppercase tracking-wide text-grey">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-grey-light"><td className="px-4 py-3" colSpan={6}><Skeleton className="h-6 w-full" /></td></tr>
                ))
              : data?.orders?.map((order) => (
                  <tr key={order._id} className="border-t border-grey-light hover:bg-offwhite">
                    <td className="px-4 py-3">
                      <Link to={`/admin/orders/${order._id}`} className="hover:text-gold">{order.orderNumber}</Link>
                    </td>
                    <td className="px-4 py-3">{order.user?.name || order.shippingAddress?.fullName}</td>
                    <td className="px-4 py-3 text-grey">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">{formatNaira(order.total)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'error' : 'warning'}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[order.status]}>{order.status.replace(/_/g, ' ')}</Badge>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Pagination page={data?.pagination?.page || 1} pages={data?.pagination?.pages || 1} onChange={(page) => setFilters((f) => ({ ...f, page }))} />
    </div>
  );
}
