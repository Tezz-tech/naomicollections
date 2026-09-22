import { z } from 'zod';
import { ADMIN_PERMISSIONS } from '../controllers/adminUser.controller.js';

export const createAdminSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  permissions: z.array(z.enum(ADMIN_PERMISSIONS)).optional(),
});

export const updateAdminSchema = z.object({
  permissions: z.array(z.enum(ADMIN_PERMISSIONS)).optional(),
  isBlocked: z.boolean().optional(),
});
