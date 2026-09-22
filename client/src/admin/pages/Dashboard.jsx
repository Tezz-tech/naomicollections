import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import { useOverview } from '../../features/admin/hooks';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import { Badge, Card, Divider, Skeleton } from '../../components/ui';
import { formatNaira, formatDate } from '../../lib/format';

export default function Dashboard() {
  const { data, isLoading } = useOverview();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl">Overview</h1>
        <p className="mt-1 text-sm text-grey">Store performance at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue Today" value={formatNaira(data.revenue.today)} icon={DollarSign} hint={`${data.ordersToday} order(s)`} />
        <StatCard label="Revenue (7 days)" value={formatNaira(data.revenue.week)} icon={TrendingUp} />
        <StatCard label="Revenue (30 days)" value={formatNaira(data.revenue.month)} icon={TrendingUp} />
        <StatCard label="Avg. Order Value" value={formatNaira(data.averageOrderValue)} icon={ShoppingBag} hint={`${data.ordersCount} total orders`} />
      </div>

      <Card className="p-6">
        <p className="section-label mb-4">Revenue — Last 30 Days</p>
        <SalesChart data={data.salesChart} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="section-label">Recent Orders</p>
            <Link to="/admin/orders" className="link-underline text-xs text-grey">View all</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {data.recentOrders.map((order) => (
              <li key={order._id} className="flex items-center justify-between text-sm">
                <div>
                  <Link to={`/admin/orders/${order._id}`} className="hover:text-gold">{order.orderNumber}</Link>
                  <p className="text-xs text-grey">{order.shippingAddress?.fullName} &middot; {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>{order.status}</Badge>
                  <span className="text-gold">{formatNaira(order.total)}</span>
                </div>
              </li>
            ))}
            {data.recentOrders.length === 0 && <p className="text-sm text-grey">No orders yet.</p>}
          </ul>
        </Card>

        <Card className="p-6">
          <p className="section-label">Top Products</p>
          <ul className="mt-4 space-y-3">
            {data.topProducts.map((p) => (
              <li key={p._id} className="flex items-center gap-3">
                <img src={p.images?.[0]?.url} alt="" className="h-10 w-10 object-cover" />
                <div className="flex-1">
                  <p className="text-sm">{p.name}</p>
                  <p className="text-xs text-grey">{p.soldCount} sold</p>
                </div>
                <span className="text-sm text-gold">{formatNaira(p.basePrice)}</span>
              </li>
            ))}
            {data.topProducts.length === 0 && <p className="text-sm text-grey">No sales data yet.</p>}
          </ul>
        </Card>
      </div>

      {data.lowStock.length > 0 && (
        <Card className="border-status-warning/40 p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-status-warning" />
            <p className="section-label !text-status-warning">Low Stock Alerts</p>
          </div>
          <Divider className="my-4" />
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.lowStock.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span>
                  {item.name} {item.sku && <span className="text-grey">({item.sku})</span>}
                </span>
                <Badge variant="warning">{item.stock} left</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {data.newBulkRequests > 0 && (
        <Link to="/admin/bulk-requests" className="block">
          <Card className="border-gold/40 bg-gold/5 p-4 text-center text-sm">
            {data.newBulkRequests} new bulk quote request(s) awaiting response
          </Card>
        </Link>
      )}
    </div>
  );
}
