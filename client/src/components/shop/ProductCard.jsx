import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { Badge } from '../ui';
import { formatNaira } from '../../lib/format';
import { getTotalStock } from '../../lib/pricing';
import { useAuthStore } from '../../store/authStore';
import { useWishlist, useToggleWishlist } from '../../features/users/hooks';

export default function ProductCard({ product, index = 0 }) {
  const outOfStock = getTotalStock(product) <= 0;
  const onSale = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { data: wishlist } = useWishlist();
  const { mutate: toggleWishlist } = useToggleWishlist();
  const isWishlisted = !!wishlist?.some((p) => p._id === product._id);

  function handleWishlistClick(e) {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    toggleWishlist(product._id, {
      onSuccess: (res) => toast.success(res.added ? 'Added to wishlist.' : 'Removed from wishlist.'),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="img-zoom relative aspect-[3/4] bg-offwhite">
          <img
            src={product.images?.[0]?.url}
            alt={product.images?.[0]?.alt || product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          {product.images?.[1] && (
            <img
              src={product.images[1].url}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNewArrival && <Badge variant="black">New</Badge>}
            {product.isFlashSale && <Badge variant="error">Flash Sale</Badge>}
            {(product.saleType === 'bulk' || product.saleType === 'both') && (
              <Badge variant="gold">Bulk</Badge>
            )}
          </div>

          <button
            type="button"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleWishlistClick}
            className={clsx(
              'absolute right-3 top-3 rounded-full bg-white/90 p-2 text-black shadow-subtle transition-opacity duration-300',
              isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            <Heart className={clsx('h-4 w-4', isWishlisted && 'fill-gold text-gold')} />
          </button>

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="section-label">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="mt-3 text-center">
          <h3 className="font-serif text-base leading-snug">{product.name}</h3>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-sm text-gold">{formatNaira(product.basePrice)}</span>
            {onSale && (
              <span className="text-xs text-grey line-through">
                {formatNaira(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
