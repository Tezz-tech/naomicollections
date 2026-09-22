import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().trim().min(3).max(30),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().min(0),
  minSpend: z.number().min(0).optional(),
  usageLimit: z.number().min(1).nullable().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCouponSchema = createCouponSchema.partial();

export const validateCouponSchema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.number().min(0),
});
