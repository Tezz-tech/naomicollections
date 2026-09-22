import { z } from 'zod';

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
  alt: z.string().optional(),
});

const variantSchema = z.object({
  size: z.string().trim().optional(),
  color: z.string().trim().optional(),
  sku: z.string().trim().min(1),
  stock: z.number().min(0),
  priceOverride: z.number().min(0).optional(),
});

const bulkTierSchema = z.object({
  minQty: z.number().min(1),
  maxQty: z.number().min(1).optional(),
  pricePerUnit: z.number().min(0),
});

export const createProductSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().min(10),
    shortDescription: z.string().trim().max(240).optional(),
    category: z.string().min(1, 'Category is required'),
    tags: z.array(z.string()).optional(),
    brand: z.string().optional(),
    images: z.array(imageSchema).min(1, 'At least one image is required'),
    variants: z.array(variantSchema).optional(),
    stock: z.number().min(0).optional(),
    basePrice: z.number().min(0),
    compareAtPrice: z.number().min(0).optional(),
    saleType: z.enum(['single', 'bulk', 'both']).optional(),
    minOrderQuantity: z.number().min(1).optional(),
    bulkTiers: z.array(bulkTierSchema).optional(),
    status: z.enum(['draft', 'published']).optional(),
    isFeatured: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isFlashSale: z.boolean().optional(),
    flashSale: z
      .object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        discountPercent: z.number().min(0).max(90).optional(),
      })
      .optional(),
    sizeGuide: z.string().optional(),
    seo: z.object({ metaTitle: z.string().optional(), metaDescription: z.string().optional() }).optional(),
  })
  .refine((data) => data.saleType === 'single' || (data.bulkTiers && data.bulkTiers.length > 0) || data.saleType === undefined, {
    message: 'Bulk-enabled products need at least one pricing tier',
    path: ['bulkTiers'],
  });

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().min(10),
    shortDescription: z.string().trim().max(240),
    category: z.string().min(1),
    tags: z.array(z.string()),
    brand: z.string(),
    images: z.array(imageSchema).min(1),
    variants: z.array(variantSchema),
    stock: z.number().min(0),
    basePrice: z.number().min(0),
    compareAtPrice: z.number().min(0),
    saleType: z.enum(['single', 'bulk', 'both']),
    minOrderQuantity: z.number().min(1),
    bulkTiers: z.array(bulkTierSchema),
    status: z.enum(['draft', 'published']),
    isFeatured: z.boolean(),
    isNewArrival: z.boolean(),
    isFlashSale: z.boolean(),
    flashSale: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      discountPercent: z.number().min(0).max(90).optional(),
    }),
    sizeGuide: z.string(),
    seo: z.object({ metaTitle: z.string().optional(), metaDescription: z.string().optional() }),
  })
  .partial();

export const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  saleType: z.enum(['single', 'bulk', 'both']).optional(),
  status: z.string().optional(),
  isFeatured: z.string().optional(),
  isNewArrival: z.string().optional(),
  isFlashSale: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  inStock: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
