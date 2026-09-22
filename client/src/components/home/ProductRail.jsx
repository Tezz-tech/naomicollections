import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../shop/ProductCard';
import ProductCardSkeleton from '../shop/ProductCardSkeleton';
import { Divider } from '../ui';

export default function ProductRail({ label, title, products, isLoading, viewAllHref }) {
  return (
    <section className="container-luxury py-16 sm:py-20">
      <Divider label={label} />
      <div className="mt-6 flex items-end justify-between">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-serif text-2xl sm:text-3xl"
        >
          {title}
        </motion.h2>
        {viewAllHref && (
          <Link to={viewAllHref} className="link-underline flex items-center gap-1 text-xs uppercase tracking-wide text-grey">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products?.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
      </div>

      {!isLoading && products?.length === 0 && (
        <p className="mt-8 text-center text-sm text-grey">Nothing here yet — check back soon.</p>
      )}
    </section>
  );
}
