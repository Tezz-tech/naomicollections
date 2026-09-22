import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button, Divider } from '../components/ui';
import { formatNaira } from '../lib/format';
import { getUnitPrice } from '../lib/pricing';

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + getUnitPrice(item, item.quantity, item.variantSku) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="container-luxury flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag className="h-10 w-10 text-grey" />
        <p className="mt-4 font-serif text-2xl">Your bag is empty</p>
        <p className="mt-2 text-sm text-grey">Explore the collection and find something you love.</p>
        <Button as={Link} to="/shop" className="mt-6">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container-luxury py-12">
      <Divider label="Your Selections" />
      <h1 className="mt-4 text-center font-serif text-3xl">Shopping Bag</h1>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-grey-light">
          {items.map((item) => (
            <motion.li
              key={item.key}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-5 py-6"
            >
              <Link to={`/product/${item.slug}`} className="h-32 w-24 shrink-0 bg-offwhite">
                {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/product/${item.slug}`} className="font-serif text-lg hover:text-gold">
                      {item.name}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="mt-1 text-xs text-grey">
                        {[item.color, item.size].filter(Boolean).join(' / ')}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeItem(item.key)} className="text-grey hover:text-status-error">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center border border-grey-light">
                    <button
                      className="p-2 hover:bg-offwhite"
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      className="p-2 hover:bg-offwhite"
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-serif text-lg text-gold">
                    {formatNaira(getUnitPrice(item, item.quantity, item.variantSku) * item.quantity)}
                  </span>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="h-fit border border-grey-light p-6">
          <h2 className="section-label mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-grey">Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-grey">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="mt-5 flex justify-between border-t border-grey-light pt-5 font-serif text-lg">
            <span>Total</span>
            <span className="text-gold">{formatNaira(subtotal)}</span>
          </div>
          <Button as={Link} to="/checkout" fullWidth size="lg" className="mt-6">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
