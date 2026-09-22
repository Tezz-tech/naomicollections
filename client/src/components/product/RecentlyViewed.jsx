import { useRecentlyViewedStore } from '../../store/recentlyViewedStore';
import ProductCard from '../shop/ProductCard';
import { Divider } from '../ui';

export default function RecentlyViewed({ excludeId }) {
  const items = useRecentlyViewedStore((s) => s.items).filter((p) => p._id !== excludeId);

  if (items.length === 0) return null;

  return (
    <section className="mt-24">
      <Divider label="Recently Viewed" />
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
        {items.slice(0, 4).map((product, i) => (
          <ProductCard key={product._id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
