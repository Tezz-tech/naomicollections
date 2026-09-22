import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useCategories } from '../../features/categories/hooks';
import { useAuthStore } from '../../store/authStore';

export default function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUiStore();
  const { data: categories = [] } = useCategories();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  return createPortal(
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-black/50"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 flex h-full w-full max-w-xs flex-col bg-white shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-grey-light px-5 py-5">
              <span className="font-serif text-lg">Menu</span>
              <button onClick={closeMobileMenu} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/shop?category=${cat._id}`}
                      onClick={closeMobileMenu}
                      className="font-serif text-lg"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/shop?isNewArrival=true" onClick={closeMobileMenu} className="font-serif text-lg">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to="/bulk-orders" onClick={closeMobileMenu} className="font-serif text-lg">
                    Bulk Orders
                  </Link>
                </li>
              </ul>

              <div className="mt-8 space-y-3 border-t border-grey-light pt-6">
                <Link
                  to={isAdmin ? '/admin' : user ? '/account' : '/login'}
                  onClick={closeMobileMenu}
                  className="section-label block"
                >
                  {isAdmin ? 'Admin Dashboard' : user ? 'My Account' : 'Login / Register'}
                </Link>
                {user && !isAdmin && (
                  <Link to="/account/wishlist" onClick={closeMobileMenu} className="section-label block">
                    Wishlist
                  </Link>
                )}
              </div>
            </nav>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
