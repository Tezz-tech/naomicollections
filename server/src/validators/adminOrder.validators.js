import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']),
  note: z.string().trim().max(500).optional(),
});

export const updateEstimatedDeliverySchema = z.object({
  estimatedDeliveryDate: z.string().min(1),
});

export const addTrackingNoteSchema = z.object({
  note: z.string().trim().min(1).max(500),
});
