import { useWishlist } from '../../features/users/hooks';
import ProductCard from '../../components/shop/ProductCard';
import ProductCardSkeleton from '../../components/shop/ProductCardSkeleton';

export default function AccountWishlist() {
  const { data: products, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!products?.length) {
    return <p className="text-sm text-grey">Your wishlist is empty — tap the heart icon on any product to save it here.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
      {products.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
    </div>
  );
}
