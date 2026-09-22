import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  if (!images.length) {
    return <div className="aspect-[3/4] w-full bg-offwhite" />;
  }

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex shrink-0 gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-16 w-14 shrink-0 overflow-hidden border transition-colors ${
              active === i ? 'border-gold' : 'border-grey-light hover:border-black'
            }`}
          >
            <img src={img.url} alt={img.alt || ''} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div
        className="relative flex-1 cursor-zoom-in overflow-hidden bg-offwhite"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={images[active].url}
            alt={images[active].alt || ''}
            className="aspect-[3/4] w-full object-cover transition-transform duration-200 ease-out"
            style={
              isZooming
                ? { transform: 'scale(1.8)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                : undefined
            }
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
