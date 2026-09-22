import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useProducts } from '../features/products/hooks';
import ProductCard from '../components/shop/ProductCard';
import ProductCardSkeleton from '../components/shop/ProductCardSkeleton';
import BulkQuoteForm from '../components/bulk/BulkQuoteForm';
import { Divider } from '../components/ui';

export default function BulkOrders() {
  const { data, isLoading } = useProducts({ saleType: 'both', limit: 24 });

  return (
    <div className="container-luxury py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl text-center"
      >
        <Package className="mx-auto h-8 w-8 text-gold" />
        <Divider label="For Businesses & Resellers" className="mt-4" />
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl">Bulk Orders</h1>
        <p className="mt-4 text-sm leading-relaxed text-grey">
          Tiered pricing on select pieces — the more you order, the less you pay per unit.
          Every eligible product below shows its minimum order quantity and pricing tiers. Need a
          custom quantity or a piece not listed here? Send a quote request below.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : data?.products?.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
      </div>

      {!isLoading && data?.products?.length === 0 && (
        <p className="mt-12 text-center text-sm text-grey">No bulk-enabled products available right now.</p>
      )}

      <div className="mx-auto mt-24 max-w-2xl">
        <Divider label="Request a Custom Quote" />
        <h2 className="mt-6 text-center font-serif text-2xl">Tell Us What You Need</h2>
        <div className="mt-10">
          <BulkQuoteForm />
        </div>
      </div>
    </div>
  );
}
