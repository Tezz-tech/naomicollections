import { NavLink, Outlet, Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard, Package, Layers, ShoppingBag, Users, Boxes, Truck, Tag,
  Image, Mail, CreditCard, Star, ShieldCheck, Settings, Bell, LogOut,
} from 'lucide-react';
import { useLogout } from '../../features/auth/hooks';
import { useAuthStore } from '../../store/authStore';
import { useNotifications } from '../../features/admin/hooks';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/bulk-requests', label: 'Bulk Requests', icon: Boxes },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/delivery', label: 'Delivery Zones', icon: Truck },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/admin/content', label: 'Content', icon: Image },
  { to: '/admin/emails', label: 'Emails', icon: Mail },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/admins', label: 'Admins & Roles', icon: ShieldCheck, superOnly: true },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const { data: notifications } = useNotifications();
  const totalAlerts = (notifications?.newOrders || 0) + (notifications?.newBulkRequests || 0) + (notifications?.lowStockCount || 0);

  // Limited admins see every section — mutating actions are still gated
  // server-side by their assigned permissions regardless of what's visible here.
  const visibleNav = NAV.filter((item) => !item.superOnly || user?.role === 'super-admin');

  return (
    <div className="flex min-h-screen bg-offwhite">
      <aside className="no-print hidden w-64 shrink-0 border-r border-grey-light bg-black text-white lg:flex lg:flex-col">
        <Link to="/admin" className="flex items-center gap-2.5 border-b border-white/10 px-6 py-6">
          <img src="/logo-mark.png" alt="" className="h-9 w-auto invert" />
          <span className="leading-none">
            <span className="block font-serif text-base tracking-wide">NAOMI'S</span>
            <span className="block text-[9px] font-medium tracking-widest2 text-gold">ADMIN</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {visibleNav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-sharp px-3 py-2.5 text-sm transition-colors',
                  isActive ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm">{user?.name}</p>
          <p className="truncate text-xs text-white/50">{user?.role}</p>
          <button
            onClick={() => logout()}
            className="mt-3 flex items-center gap-2 text-xs text-white/70 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="no-print sticky top-0 z-20 flex h-16 items-center justify-between border-b border-grey-light bg-white px-6">
          <p className="font-serif text-lg lg:hidden">Naomi's Admin</p>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <Link to="/admin/orders" className="relative p-2 text-grey hover:text-black">
              <Bell className="h-5 w-5" />
              {totalAlerts > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-error text-[9px] text-white">
                  {totalAlerts}
                </span>
              )}
            </Link>
            <Link to="/" target="_blank" className="link-underline text-xs uppercase tracking-wide text-grey">
              View Store
            </Link>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
