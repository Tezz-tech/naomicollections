import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCategories } from '../../features/categories/hooks';
import { Divider, Skeleton } from '../ui';

export default function CategoryTiles() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="container-luxury py-16 sm:py-20">
      <Divider label="Shop by Category" />
      <h2 className="mt-6 text-center font-serif text-2xl sm:text-3xl">Find Your Fit</h2>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4]" />)
          : categories?.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link to={`/shop?category=${cat._id}`} className="img-zoom group relative block aspect-[3/4] overflow-hidden bg-offwhite">
                  {cat.image?.url ? (
                    <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black">
                      <span className="font-serif text-2xl text-white/40">{cat.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                    <span className="font-serif text-xl sm:text-2xl">{cat.name}</span>
                    <span className="mt-2 h-px w-8 bg-gold transition-all duration-500 group-hover:w-16" />
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}
