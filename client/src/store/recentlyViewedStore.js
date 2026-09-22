import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTotalStock } from '../lib/pricing';

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [], // lightweight product summaries, newest first

      addItem: (product) => {
        const items = get().items.filter((p) => p._id !== product._id);
        items.unshift({
          _id: product._id,
          name: product.name,
          slug: product.slug,
          images: product.images?.slice(0, 1),
          basePrice: product.basePrice,
          compareAtPrice: product.compareAtPrice,
          saleType: product.saleType,
          stock: getTotalStock(product),
          isNewArrival: product.isNewArrival,
          isFlashSale: product.isFlashSale,
        });
        set({ items: items.slice(0, MAX_ITEMS) });
      },
    }),
    { name: 'naomis-recently-viewed' }
  )
);
