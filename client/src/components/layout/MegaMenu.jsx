import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCategories } from '../../features/categories/hooks';

export default function MegaMenu() {
  const { data: categories = [] } = useCategories();
  const [active, setActive] = useState(null);

  const staticLinks = [
    { label: 'New Arrivals', to: '/shop?isNewArrival=true' },
    { label: 'Bulk Orders', to: '/bulk-orders' },
  ];

  return (
    <nav className="hidden lg:flex" onMouseLeave={() => setActive(null)}>
      <ul className="flex items-center gap-8">
        {categories.map((cat) => (
          <li key={cat._id} onMouseEnter={() => setActive(cat._id)} className="relative">
            <Link
              to={`/shop?category=${cat._id}`}
              className="link-underline py-6 text-xs font-medium uppercase tracking-widest2 text-black"
            >
              {cat.name}
            </Link>

            <AnimatePresence>
              {active === cat._id && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-1/2 top-full z-30 w-64 -translate-x-1/2 border border-grey-light bg-white p-5 shadow-lift"
                >
                  <p className="section-label mb-3">{cat.name}</p>
                  <ul className="space-y-2.5">
                    <li>
                      <Link to={`/shop?category=${cat._id}`} className="link-underline text-sm">
                        Shop All {cat.name}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/shop?category=${cat._id}&isNewArrival=true`}
                        className="link-underline text-sm"
                      >
                        New Arrivals
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/shop?category=${cat._id}&saleType=both`}
                        className="link-underline text-sm"
                      >
                        Bulk Deals
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}

        {staticLinks.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="link-underline py-6 text-xs font-medium uppercase tracking-widest2 text-black"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
