import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCustomer } from '../../features/admin/hooks';
import { Badge, Card, Skeleton } from '../../components/ui';
import { formatDate, formatNaira } from '../../lib/format';

export default function CustomerDetail() {
  const { id } = useParams();
  const { data, isLoading } = useCustomer(id);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!data) return <p className="text-sm text-grey">Customer not found.</p>;

  const { customer, orders } = data;

  return (
    <div>
      <Link to="/admin/customers" className="link-underline flex items-center gap-1.5 text-xs uppercase tracking-wide text-grey">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Customers
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl">{customer.name}</h1>
          <p className="mt-1 text-sm text-grey">{customer.email} &middot; {customer.phone || 'No phone'}</p>
        </div>
        <Badge variant={customer.isBlocked ? 'error' : 'success'}>{customer.isBlocked ? 'Blocked' : 'Active'}</Badge>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="section-label mb-4">Saved Addresses</p>
          {customer.addresses?.length ? (
            <ul className="space-y-3 text-sm">
              {customer.addresses.map((a) => (
                <li key={a._id} className="border-b border-grey-light pb-3 last:border-0">
                  {a.fullName} &middot; {a.phone}<br />
                  <span className="text-grey">{a.street}, {a.city}, {a.state}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-grey">No saved addresses.</p>}
        </Card>

        <Card className="p-6">
          <p className="section-label mb-4">Account Info</p>
          <p className="text-sm">Joined: <span className="text-grey">{formatDate(customer.createdAt)}</span></p>
          <p className="mt-2 text-sm">Email Verified: <span className="text-grey">{customer.isVerified ? 'Yes' : 'No'}</span></p>
          <p className="mt-2 text-sm">Wishlist Items: <span className="text-grey">{customer.wishlist?.length || 0}</span></p>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <p className="section-label mb-4">Order History</p>
        {orders?.length ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-grey-light text-left text-xs uppercase tracking-wide text-grey">
                <th className="py-2">Order</th>
                <th className="py-2">Date</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-grey-light last:border-0">
                  <td className="py-2.5"><Link to={`/admin/orders/${o._id}`} className="hover:text-gold">{o.orderNumber}</Link></td>
                  <td className="py-2.5 text-grey">{formatDate(o.createdAt)}</td>
                  <td className="py-2.5">{formatNaira(o.total)}</td>
                  <td className="py-2.5"><Badge variant="outline">{o.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-sm text-grey">No orders yet.</p>}
      </Card>
    </div>
  );
}
