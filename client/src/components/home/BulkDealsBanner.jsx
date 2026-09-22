import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Button } from '../ui';

export default function BulkDealsBanner() {
  return (
    <section className="container-luxury py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden border border-grey-light bg-black px-6 py-16 text-center text-white sm:px-16"
      >
        <Package className="mx-auto h-8 w-8 text-gold" />
        <p className="section-label mt-4 !text-gold">For Businesses & Resellers</p>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Bulk Orders, Better Rates</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-white/70">
          Tiered pricing on select pieces — the more you order, the less you pay per unit. Perfect
          for events, uniforms, and resale.
        </p>
        <Button as={Link} to="/bulk-orders" variant="gold" size="lg" className="mt-8">
          Explore Bulk Deals
        </Button>
      </motion.div>
    </section>
  );
}
