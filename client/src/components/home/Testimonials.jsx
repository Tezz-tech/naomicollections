import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Divider } from '../ui';

const testimonials = [
  {
    name: 'Adaeze O.',
    role: 'Lagos, Nigeria',
    quote:
      'The tailoring is impeccable — every piece feels like it was made for me specifically. Naomi’s is the only place I trust for occasion wear now.',
  },
  {
    name: 'Michael T.',
    role: 'Abuja, Nigeria',
    quote:
      'Ordered 40 shirts in bulk for my team and the pricing tier made it painless. Quality held up across every single unit.',
  },
  {
    name: 'Chidinma K.',
    role: 'Port Harcourt, Nigeria',
    quote:
      'Delivery was fast, packaging was beautiful, and the wrap dress fit like it was custom. Already planning my next order.',
  },
];

export default function Testimonials() {
  return (
    <section className="container-luxury py-16 sm:py-20">
      <Divider label="Client Stories" />
      <h2 className="mt-6 text-center font-serif text-2xl sm:text-3xl">What They're Saying</h2>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.blockquote
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border border-grey-light bg-white p-8 text-center"
          >
            <div className="flex justify-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className="h-3.5 w-3.5 fill-gold" />
              ))}
            </div>
            <p className="mt-4 font-serif text-lg italic leading-relaxed">"{t.quote}"</p>
            <footer className="mt-4 text-xs uppercase tracking-wide text-grey">
              {t.name} — {t.role}
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}
