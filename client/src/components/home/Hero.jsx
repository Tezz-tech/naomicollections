import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '../../features/banners/hooks';
import { Button, Skeleton } from '../ui';

export default function Hero() {
  const { data: banners, isLoading } = useBanners('hero');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  if (isLoading) return <Skeleton className="h-[70vh] w-full" />;
  if (!banners?.length) return null;

  return (
    <section className="relative h-[70vh] min-h-[420px] overflow-hidden bg-black">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((banner) => (
            <div key={banner._id} className="relative h-full min-w-0 flex-[0_0_100%]">
              <img
                src={banner.image?.url}
                alt={banner.title}
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto max-w-xl text-center text-white"
          >
            <p className="section-label !text-gold">Naomi's Collections</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-6xl">
              {banners[selected]?.title}
            </h1>
            {banners[selected]?.subtitle && (
              <p className="mt-4 text-sm text-white/80 sm:text-base">{banners[selected].subtitle}</p>
            )}
            {banners[selected]?.ctaText && (
              <Button as={Link} to={banners[selected].ctaLink || '/shop'} variant="gold" size="lg" className="mt-8">
                {banners[selected].ctaText}
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 p-2 text-white transition-colors hover:bg-white/10 sm:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 p-2 text-white transition-colors hover:bg-white/10 sm:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selected ? 'w-6 bg-gold' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
