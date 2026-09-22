import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../features/products/hooks';
import { useCategories } from '../features/categories/hooks';
import FilterSidebar from '../components/shop/FilterSidebar';
import SortDropdown from '../components/shop/SortDropdown';
import Pagination from '../components/shop/Pagination';
import ProductCard from '../components/shop/ProductCard';
import ProductCardSkeleton from '../components/shop/ProductCardSkeleton';
import { Divider, Modal } from '../components/ui';
import Seo from '../components/Seo';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: categories = [] } = useCategories();

  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const activeCategory = categories.find((c) => c._id === filters.category);

  const { data, isLoading } = useProducts({ ...filters, status: 'published' });

  function updateFilters(next) {
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    );
    delete cleaned.page;
    setSearchParams(cleaned);
  }

  function setPage(page) {
    setSearchParams({ ...filters, page: String(page) });
  }

  const heading = activeCategory
    ? activeCategory.name
    : filters.isNewArrival
      ? 'New Arrivals'
      : filters.search
        ? `Results for "${filters.search}"`
        : 'Shop All';

  return (
    <div className="container-luxury py-12">
      <Seo title={heading} description={`Shop ${heading.toLowerCase()} at Naomi's Collections.`} />
      <Divider label="The Collection" />
      <h1 className="mt-4 text-center font-serif text-3xl sm:text-4xl">{heading}</h1>

      <div className="mt-4 flex items-center justify-between border-b border-grey-light pb-4">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 text-xs uppercase tracking-wide lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <p className="hidden text-xs text-grey lg:block">
          {data?.pagination?.total ?? 0} {data?.pagination?.total === 1 ? 'piece' : 'pieces'}
        </p>
        <SortDropdown value={filters.sort} onChange={(sort) => updateFilters({ ...filters, sort })} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <FilterSidebar filters={filters} onChange={updateFilters} className="hidden lg:block" />

        <div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : data?.products?.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
          </div>

          {!isLoading && data?.products?.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-serif text-xl">No pieces match your filters</p>
              <button onClick={() => updateFilters({})} className="link-underline mt-3 text-xs uppercase tracking-wide text-grey">
                Clear filters
              </button>
            </div>
          )}

          <Pagination
            page={data?.pagination?.page || 1}
            pages={data?.pagination?.pages || 1}
            onChange={setPage}
          />
        </div>
      </div>

      <Modal open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filters" size="sm">
        <FilterSidebar filters={filters} onChange={updateFilters} />
      </Modal>
    </div>
  );
}
