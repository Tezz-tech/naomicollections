import { z } from 'zod';

export const createBulkRequestSchema = z.object({
  name: z.string().trim().min(2),
  businessName: z.string().trim().optional(),
  phone: z.string().trim().min(7),
  email: z.string().trim().email(),
  items: z
    .array(
      z.object({
        product: z.string().optional(),
        name: z.string().trim().min(1),
        quantity: z.number().min(1),
      })
    )
    .min(1, 'Add at least one item'),
  deliveryLocation: z.string().trim().min(2),
  notes: z.string().trim().optional(),
});
