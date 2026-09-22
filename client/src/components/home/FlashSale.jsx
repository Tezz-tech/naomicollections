import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../../features/products/hooks';
import ProductCard from '../shop/ProductCard';
import ProductCardSkeleton from '../shop/ProductCardSkeleton';
import { Divider } from '../ui';

function getTimeLeft(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: diff <= 0,
  };
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-14 w-14 items-center justify-center bg-black font-serif text-xl text-white sm:h-16 sm:w-16 sm:text-2xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1.5 text-[10px] uppercase tracking-wide text-grey">{label}</span>
    </div>
  );
}

export default function FlashSale() {
  const { data, isLoading } = useProducts({ isFlashSale: 'true', limit: 4 });
  const products = useMemo(() => data?.products || [], [data]);

  const endDate = useMemo(() => {
    const dates = products.map((p) => p.flashSale?.endDate).filter(Boolean);
    if (!dates.length) return null;
    return dates.sort((a, b) => new Date(a) - new Date(b))[0];
  }, [products]);

  const [timeLeft, setTimeLeft] = useState(() => (endDate ? getTimeLeft(endDate) : null));

  useEffect(() => {
    if (!endDate) return;
    const interval = setInterval(() => setTimeLeft(getTimeLeft(endDate)), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="bg-offwhite py-16 sm:py-20">
      <div className="container-luxury">
        <Divider label="Limited Time" />
        <div className="mt-6 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <motion.h2
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-2xl sm:text-3xl"
          >
            Flash Sale
          </motion.h2>

          {timeLeft && !timeLeft.expired && (
            <div className="flex gap-3">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <CountdownUnit value={timeLeft.hours} label="Hrs" />
              <CountdownUnit value={timeLeft.minutes} label="Min" />
              <CountdownUnit value={timeLeft.seconds} label="Sec" />
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
        </div>
      </div>
    </section>
  );
}
