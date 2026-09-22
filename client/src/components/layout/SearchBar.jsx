import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../features/products/api';
import { formatNaira } from '../../lib/format';
import { useUiStore } from '../../store/uiStore';

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar() {
  const { isSearchOpen, toggleSearch, closeSearch } = useUiStore();
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ['search-suggestions', debounced],
    queryFn: () => fetchProducts({ search: debounced, limit: 6 }),
    enabled: isSearchOpen && debounced.trim().length > 1,
  });

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
    else setQuery('');
  }, [isSearchOpen]);

  function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    closeSearch();
  }

  return (
    <>
      <button
        aria-label="Search"
        onClick={toggleSearch}
        className="p-2 text-black transition-colors hover:text-gold"
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-40 w-full overflow-hidden border-b border-grey-light bg-white shadow-lift"
          >
            <div className="container-luxury py-5">
              <form onSubmit={submit} className="relative">
                <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-grey" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, categories..."
                  className="w-full border-b border-black bg-transparent py-2 pl-8 pr-8 font-serif text-lg focus:outline-none"
                />
                {isFetching && (
                  <Loader2 className="absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-grey" />
                )}
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-grey hover:text-black"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>

              {data?.products?.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                  {data.products.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => {
                        navigate(`/product/${product.slug}`);
                        closeSearch();
                      }}
                      className="group text-left"
                    >
                      <div className="img-zoom aspect-[3/4] bg-offwhite">
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="mt-2 truncate text-xs">{product.name}</p>
                      <p className="text-xs text-gold">{formatNaira(product.basePrice)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
