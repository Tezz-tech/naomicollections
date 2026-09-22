import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import { useCustomers, useSetCustomerBlocked } from '../../features/admin/hooks';
import { Badge, Button, Input, Skeleton } from '../../components/ui';
import Pagination from '../../components/shop/Pagination';
import { formatDate } from '../../lib/format';

export default function Customers() {
  const [filters, setFilters] = useState({ page: 1, search: '' });
  const { data, isLoading } = useCustomers(filters);
  const { mutate: setBlocked } = useSetCustomerBlocked();

  function toggleBlock(customer) {
    setBlocked(
      { id: customer._id, isBlocked: !customer.isBlocked },
      { onSuccess: () => toast.success(customer.isBlocked ? 'Customer unblocked.' : 'Customer blocked.') }
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl">Customers</h1>
      <p className="mt-1 text-sm text-grey">{data?.pagination?.total ?? 0} total</p>

      <div className="relative mt-6 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey" />
        <Input placeholder="Search customers..." className="pl-9" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))} />
      </div>

      <div className="mt-6 overflow-x-auto border border-grey-light">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-offwhite text-left text-xs uppercase tracking-wide text-grey">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-grey-light"><td className="px-4 py-3" colSpan={6}><Skeleton className="h-6 w-full" /></td></tr>
                ))
              : data?.customers?.map((c) => (
                  <tr key={c._id} className="border-t border-grey-light">
                    <td className="px-4 py-3"><Link to={`/admin/customers/${c._id}`} className="hover:text-gold">{c.name}</Link></td>
                    <td className="px-4 py-3 text-grey">{c.email}</td>
                    <td className="px-4 py-3">{c.orderCount}</td>
                    <td className="px-4 py-3 text-grey">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={c.isBlocked ? 'error' : 'success'}>{c.isBlocked ? 'Blocked' : 'Active'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant={c.isBlocked ? 'secondary' : 'outline'} onClick={() => toggleBlock(c)}>
                        {c.isBlocked ? 'Unblock' : 'Block'}
                      </Button>
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
