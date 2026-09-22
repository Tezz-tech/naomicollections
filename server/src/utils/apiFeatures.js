// Turns product-list query params into a Mongoose filter, sort, and
// pagination — shared by the public shop endpoint and the admin list.
export function buildProductQuery(query) {
  const filter = {};

  if (query.category) filter.category = query.category;
  if (query.saleType) filter.saleType = query.saleType === 'both' ? { $in: ['bulk', 'both'] } : query.saleType;
  if (query.status) filter.status = query.status;
  if (query.isFeatured) filter.isFeatured = query.isFeatured === 'true';
  if (query.isNewArrival) filter.isNewArrival = query.isNewArrival === 'true';
  if (query.isFlashSale) filter.isFlashSale = query.isFlashSale === 'true';

  if (query.minPrice || query.maxPrice) {
    filter.basePrice = {};
    if (query.minPrice) filter.basePrice.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.basePrice.$lte = Number(query.maxPrice);
  }

  if (query.size) filter['variants.size'] = query.size;
  if (query.color) filter['variants.color'] = query.color;

  if (query.inStock === 'true') {
    filter.$or = [
      { variants: { $exists: true, $not: { $size: 0 }, $elemMatch: { stock: { $gt: 0 } } } },
      { variants: { $size: 0 }, stock: { $gt: 0 } },
    ];
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sortMap = {
    newest: '-createdAt',
    oldest: 'createdAt',
    price_asc: 'basePrice',
    price_desc: '-basePrice',
    popular: '-soldCount',
    rating: '-ratingsAverage',
  };
  const sort = sortMap[query.sort] || '-createdAt';

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 100);
  const skip = (page - 1) * limit;

  return { filter, sort, page, limit, skip };
}
