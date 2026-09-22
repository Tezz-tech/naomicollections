import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Guest carts live entirely here (persisted to localStorage). On login, the
// customer-account phase syncs this into the server-side Cart model.
function lineKey(productId, variantSku) {
  return `${productId}::${variantSku || 'no-variant'}`;
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { key, product, variantSku, size, color, quantity }
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (product, { variantSku, size, color, quantity = 1 } = {}) => {
        const key = lineKey(product._id, variantSku);
        const items = [...get().items];
        const existing = items.find((i) => i.key === key);

        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({
            key,
            productId: product._id,
            slug: product.slug,
            name: product.name,
            image: product.images?.[0]?.url,
            basePrice: product.basePrice,
            saleType: product.saleType,
            minOrderQuantity: product.minOrderQuantity,
            bulkTiers: product.bulkTiers,
            variantSku: variantSku || null,
            size: size || null,
            color: color || null,
            quantity,
          });
        }
        set({ items, isDrawerOpen: true });
      },

      updateQuantity: (key, quantity) => {
        if (quantity < 1) return get().removeItem(key);
        set({ items: get().items.map((i) => (i.key === key ? { ...i, quantity } : i)) });
      },

      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'naomis-cart' }
  )
);
