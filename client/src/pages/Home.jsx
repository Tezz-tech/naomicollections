import Hero from '../components/home/Hero';
import CategoryTiles from '../components/home/CategoryTiles';
import ProductRail from '../components/home/ProductRail';
import FlashSale from '../components/home/FlashSale';
import BulkDealsBanner from '../components/home/BulkDealsBanner';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import { useProducts } from '../features/products/hooks';

export default function Home() {
  const { data: newArrivals, isLoading: loadingNew } = useProducts({
    isNewArrival: 'true',
    limit: 4,
  });
  const { data: bestSellers, isLoading: loadingBest } = useProducts({ sort: 'popular', limit: 4 });
  const { data: featured, isLoading: loadingFeatured } = useProducts({
    isFeatured: 'true',
    limit: 4,
  });

  return (
    <div>
      <Hero />
      <CategoryTiles />
      <ProductRail
        label="Just In"
        title="New Arrivals"
        products={newArrivals?.products}
        isLoading={loadingNew}
        viewAllHref="/shop?isNewArrival=true"
      />
      <FlashSale />
      <ProductRail
        label="Customer Favorites"
        title="Best Sellers"
        products={bestSellers?.products}
        isLoading={loadingBest}
        viewAllHref="/shop?sort=popular"
      />
      <BulkDealsBanner />
      <ProductRail
        label="The Edit"
        title="Featured Collection"
        products={featured?.products}
        isLoading={loadingFeatured}
        viewAllHref="/shop?isFeatured=true"
      />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
