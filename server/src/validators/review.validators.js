import { z } from 'zod';

export const createReviewSchema = z.object({
  product: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  comment: z.string().trim().min(4).max(1000),
});
