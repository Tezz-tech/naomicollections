import StockNotification from '../models/StockNotification.js';
import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';
import { sendEmail, wrapBrandedEmail } from '../services/email.service.js';
import { env } from '../config/env.js';

export const requestNotification = catchAsync(async (req, res) => {
  const { email, variantSku } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError(404, 'Product not found.');

  await StockNotification.findOneAndUpdate(
    { product: product._id, variantSku: variantSku || null, email: email.toLowerCase() },
    { notified: false },
    { upsert: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, message: "We'll email you when it's back in stock." });
});

// Called whenever admin stock edits bring an item from 0 back above 0.
export async function notifyRestocked(product) {
  const variantSkus = product.variants?.length ? product.variants.map((v) => v.sku) : [null];
  const inStockSkus = product.variants?.length
    ? product.variants.filter((v) => v.stock > 0).map((v) => v.sku)
    : product.stock > 0
      ? [null]
      : [];

  if (inStockSkus.length === 0) return;

  const pending = await StockNotification.find({
    product: product._id,
    variantSku: { $in: variantSkus },
    notified: false,
  });

  for (const entry of pending) {
    if (entry.variantSku !== null && !inStockSkus.includes(entry.variantSku)) continue;
    if (entry.variantSku === null && !inStockSkus.includes(null)) continue;

    await sendEmail({
      to: entry.email,
      subject: `Back in Stock — ${product.name}`,
      type: 'custom',
      html: wrapBrandedEmail({
        heading: "It's Back",
        bodyHtml: `<p>${product.name} is back in stock. Get it before it sells out again.</p>`,
        ctaText: 'Shop Now',
        ctaUrl: `${env.clientUrl}/product/${product.slug}`,
      }),
    });
    entry.notified = true;
    await entry.save();
  }
}
