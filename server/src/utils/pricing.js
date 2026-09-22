// Server-side source of truth for what a unit of a product costs at a given
// quantity — never trust a price the client sends.
export function getUnitPrice(product, quantity = 1, variantSku = null) {
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

export function getStockForVariant(product, variantSku = null) {
  if (!product.variants?.length) return product.stock;
  if (!variantSku) return product.variants.reduce((sum, v) => sum + v.stock, 0);
  const variant = product.variants.find((v) => v.sku === variantSku);
  return variant ? variant.stock : 0;
}
