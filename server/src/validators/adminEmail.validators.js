import { z } from 'zod';

export const composeEmailSchema = z
  .object({
    to: z.string().trim().email().optional(),
    userId: z.string().optional(),
    subject: z.string().trim().min(2).max(150),
    message: z.string().trim().min(2).max(5000),
  })
  .refine((d) => d.to || d.userId, { message: 'Provide either a recipient email or a user.' });

export const newsletterSchema = z.object({
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(2).max(5000),
});
