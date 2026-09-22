import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui';
import { formatNaira } from '../../lib/format';
import { getUnitPrice } from '../../lib/pricing';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + getUnitPrice(item, item.quantity, item.variantSku) * item.quantity,
    0
  );

  return createPortal(
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[110]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/50"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-grey-light px-6 py-5">
              <h2 className="font-serif text-xl">Your Bag ({items.length})</h2>
              <button onClick={closeDrawer} aria-label="Close cart" className="text-grey hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm text-grey">Your bag is empty.</p>
                  <Button as={Link} to="/shop" variant="secondary" className="mt-4" onClick={closeDrawer}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4"
                    >
                      <div className="h-24 w-20 shrink-0 bg-offwhite">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-serif text-sm leading-snug">{item.name}</p>
                            {(item.size || item.color) && (
                              <p className="mt-0.5 text-xs text-grey">
                                {[item.color, item.size].filter(Boolean).join(' / ')}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.key)}
                            aria-label="Remove item"
                            className="text-grey hover:text-status-error"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-grey-light">
                            <button
                              className="p-1.5 hover:bg-offwhite"
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              className="p-1.5 hover:bg-offwhite"
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm text-gold">
                            {formatNaira(getUnitPrice(item, item.quantity, item.variantSku) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-grey-light px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm uppercase tracking-wide text-grey">Subtotal</span>
                  <span className="font-serif text-lg">{formatNaira(subtotal)}</span>
                </div>
                <Button as={Link} to="/checkout" fullWidth size="lg" onClick={closeDrawer}>
                  Checkout
                </Button>
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="link-underline mt-3 block text-center text-xs uppercase tracking-wide text-grey"
                >
                  View Full Bag
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
