import ProductCard from '../shop/ProductCard';
import ProductCardSkeleton from '../shop/ProductCardSkeleton';
import { Divider } from '../ui';

export default function RelatedProducts({ products, isLoading }) {
  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section className="mt-24">
      <Divider label="You May Also Like" />
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
      </div>
    </section>
  );
}
