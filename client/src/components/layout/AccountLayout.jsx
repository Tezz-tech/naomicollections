import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { User, Package, MapPin, Heart, Boxes, LogOut } from 'lucide-react';
import { useLogout } from '../../features/auth/hooks';
import { useAuthStore } from '../../store/authStore';
import { Divider } from '../ui';

const NAV = [
  { to: '/account', label: 'Overview', icon: User, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/bulk-requests', label: 'Bulk Requests', icon: Boxes },
];

export default function AccountLayout() {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  return (
    <div className="container-luxury py-12">
      <Divider label="My Account" />
      <h1 className="mt-4 text-center font-serif text-3xl">Hello, {user?.name?.split(' ')[0]}</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="space-y-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                    isActive ? 'bg-black text-white' : 'text-grey hover:bg-offwhite hover:text-black'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-grey transition-colors hover:bg-offwhite hover:text-status-error"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </nav>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
