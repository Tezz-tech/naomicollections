import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { ApiError } from '../middleware/errorHandler.js';
import { getUnitPrice, getStockForVariant } from '../utils/pricing.js';
import { computeDiscount } from '../utils/coupons.js';
import { resolveDelivery } from '../utils/delivery.js';

// The one place order totals get computed. Called by both the pre-checkout
// "quote" endpoint (for live checkout-page display) and actual order
// creation — nothing here ever trusts a price or total sent by the client.
export async function buildOrderItems(rawItems) {
  const products = await Product.find({
    _id: { $in: rawItems.map((i) => i.productId) },
  });

  const items = rawItems.map(({ productId, variantSku, quantity }) => {
    const product = products.find((p) => p._id.toString() === productId);
    if (!product || product.status !== 'published') {
      throw new ApiError(400, 'One of the items in your bag is no longer available.');
    }

    if (product.variants.length > 0 && !variantSku) {
      throw new ApiError(400, `Please select a size/color for "${product.name}".`);
    }
    const variant = variantSku ? product.variants.find((v) => v.sku === variantSku) : null;
    if (variantSku && !variant) {
      throw new ApiError(400, `The selected option for "${product.name}" is no longer available.`);
    }

    const isBulkOnly = product.saleType === 'bulk';
    const minQty = isBulkOnly ? product.minOrderQuantity : 1;
    if (quantity < minQty) {
      throw new ApiError(400, `"${product.name}" requires a minimum order quantity of ${minQty}.`);
    }

    const stock = getStockForVariant(product, variantSku);
    if (stock < quantity) {
      throw new ApiError(400, `"${product.name}" only has ${stock} unit(s) left in stock.`);
    }

    const unitPrice = getUnitPrice(product, quantity, variantSku);
    const isBulkPricing =
      (product.saleType === 'bulk' || product.saleType === 'both') && quantity >= product.minOrderQuantity;

    return {
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      sku: variant?.sku,
      size: variant?.size,
      color: variant?.color,
      quantity,
      unitPrice,
      total: unitPrice * quantity,
      saleType: isBulkPricing ? 'bulk' : 'single',
    };
  });

  return items;
}

export async function computeOrderTotals({ items: rawItems, state, city, couponCode }) {
  const items = await buildOrderItems(rawItems);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  let discount = 0;
  let couponResult = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) throw new ApiError(400, 'Invalid coupon code.');
    const validity = coupon.isValidFor(subtotal);
    if (!validity.ok) throw new ApiError(400, validity.reason);
    discount = computeDiscount(coupon, subtotal);
    couponResult = coupon;
  }

  let delivery = null;
  if (state) {
    delivery = await resolveDelivery(state, city, subtotal - discount);
  }

  const deliveryFee = delivery?.deliveryFee ?? 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  return { items, subtotal, discount, deliveryFee, total, delivery, coupon: couponResult };
}
