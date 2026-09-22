import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().trim().max(40).optional(),
  fullName: z.string().trim().min(2, 'Required'),
  phone: z.string().trim().min(7, 'Required'),
  state: z.string().trim().min(1, 'Select a state'),
  city: z.string().trim().min(2, 'Required'),
  lga: z.string().trim().optional(),
  street: z.string().trim().min(4, 'Required'),
  landmark: z.string().trim().optional(),
  isDefault: z.boolean().optional(),
});
