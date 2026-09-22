// Mirrors server/src/utils/pricing.js for display purposes only — the
// server always recalculates and is the source of truth for what's charged.
export function getUnitPrice(product, quantity = 1, variantSku = null) {
  if (!product) return 0;
  let base = product.basePrice;

  if (variantSku && product.variants?.length) {
    const variant = product.variants.find((v) => v.sku === variantSku);
    if (variant?.priceOverride != null) base = variant.priceOverride;
  }

  if (product.saleType === 'single') return base;

  if (product.saleType === 'bulk' || product.saleType === 'both') {
    const eligibleForBulk = product.saleType === 'bulk' || quantity >= product.minOrderQuantity;
    if (eligibleForBulk && product.bulkTiers?.length) {
      const tier = [...product.bulkTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find((t) => quantity >= t.minQty && (t.maxQty == null || quantity <= t.maxQty));
      if (tier) return tier.pricePerUnit;
    }
  }

  return base;
}

export function getTotalStock(product) {
  if (!product) return 0;
  if (product.variants?.length) return product.variants.reduce((sum, v) => sum + v.stock, 0);
  return product.stock || 0;
}
