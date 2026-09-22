import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(500).optional(),
  image: z.object({ url: z.string().url(), publicId: z.string().optional() }).optional(),
  parent: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  showInMenu: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const reorderCategoriesSchema = z.object({
  order: z.array(z.object({ id: z.string(), sortOrder: z.number() })),
});
