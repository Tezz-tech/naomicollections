import { Link } from 'react-router-dom';
import { Menu, User, Heart, ShoppingBag } from 'lucide-react';
import MegaMenu from './MegaMenu';
import SearchBar from './SearchBar';
import { useUiStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { openMobileMenu } = useUiStore();
  const { items, openDrawer } = useCartStore();
  const { user } = useAuthStore();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';
  const accountHref = isAdmin ? '/admin' : user ? '/account' : '/login';

  return (
    <header className="sticky top-0 z-50 border-b border-grey-light bg-white/95 backdrop-blur">
      <div className="container-luxury relative flex h-20 items-center justify-between">
        <button onClick={openMobileMenu} aria-label="Open menu" className="p-2 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo-mark.png" alt="" className="h-10 w-auto sm:h-12" />
          <span className="hidden leading-none sm:block">
            <span className="block font-serif text-lg tracking-wide">NAOMI'S</span>
            <span className="block text-[9px] font-medium tracking-widest2 text-gold">COLLECTIONS</span>
          </span>
        </Link>

        <MegaMenu />

        <div className="flex items-center gap-1 sm:gap-2">
          <SearchBar />
          <Link
            to={accountHref}
            aria-label={isAdmin ? 'Admin Dashboard' : 'Account'}
            className="hidden p-2 transition-colors hover:text-gold sm:block"
          >
            <User className="h-5 w-5" />
          </Link>
          {!isAdmin && (
            <Link
              to={user ? '/account/wishlist' : '/login'}
              state={user ? undefined : { from: '/account/wishlist' }}
              aria-label="Wishlist"
              className="hidden p-2 transition-colors hover:text-gold sm:block"
            >
              <Heart className="h-5 w-5" />
            </Link>
          )}
          <button onClick={openDrawer} aria-label="Cart" className="relative p-2 transition-colors hover:text-gold">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-black">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
