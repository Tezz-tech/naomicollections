import { z } from 'zod';

export const updateSettingsSchema = z.object({
  storeName: z.string().trim().min(2).optional(),
  storeEmail: z.string().trim().email().optional(),
  storePhone: z.string().trim().optional(),
  currency: z.string().trim().optional(),
  socialLinks: z
    .object({
      instagram: z.string().trim().optional(),
      facebook: z.string().trim().optional(),
      twitter: z.string().trim().optional(),
      whatsapp: z.string().trim().optional(),
    })
    .optional(),
  announcementBar: z
    .object({
      text: z.string().trim().optional(),
      link: z.string().trim().optional(),
      isActive: z.boolean().optional(),
    })
    .optional(),
  freeDeliveryThreshold: z.number().min(0).optional(),
});
