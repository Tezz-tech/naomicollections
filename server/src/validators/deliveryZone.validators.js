import { z } from 'zod';

const cityOverrideSchema = z.object({
  name: z.string().trim().min(1),
  fee: z.number().min(0),
  minDays: z.number().min(0),
  maxDays: z.number().min(0),
});

export const upsertDeliveryZoneSchema = z.object({
  state: z.string().trim().min(2),
  fee: z.number().min(0),
  minDays: z.number().min(0),
  maxDays: z.number().min(0),
  cityOverrides: z.array(cityOverrideSchema).optional(),
  isActive: z.boolean().optional(),
});
