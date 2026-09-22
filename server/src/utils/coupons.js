export function computeDiscount(coupon, subtotal) {
  if (coupon.type === 'percentage') return Math.round((subtotal * coupon.value) / 100);
  return Math.min(coupon.value, subtotal);
}
