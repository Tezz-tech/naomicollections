import { z } from 'zod';

export const quoteResponseSchema = z.object({
  amount: z.number().min(0),
  notes: z.string().trim().max(1000).optional(),
});

export const convertToOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantSku: z.string().optional(),
        quantity: z.number().min(1),
      })
    )
    .min(1),
  shippingAddress: z.object({
    fullName: z.string().trim().min(2),
    phone: z.string().trim().min(7),
    state: z.string().trim().min(2),
    city: z.string().trim().min(2),
    lga: z.string().trim().optional(),
    street: z.string().trim().min(4),
    landmark: z.string().trim().optional(),
  }),
});
