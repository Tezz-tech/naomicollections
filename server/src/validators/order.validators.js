import { z } from 'zod';

const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantSku: z.string().optional(),
  quantity: z.number().min(1),
});

const addressSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(7).max(20),
  state: z.string().trim().min(2),
  city: z.string().trim().min(2),
  lga: z.string().trim().optional(),
  street: z.string().trim().min(4),
  landmark: z.string().trim().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Your bag is empty'),
  shippingAddress: addressSchema,
  couponCode: z.string().trim().optional(),
  guestInfo: z
    .object({
      name: z.string().trim().min(2),
      email: z.string().trim().email(),
      phone: z.string().trim().min(7),
    })
    .optional(),
});

export const quoteSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  state: z.string().trim().min(2).optional(),
  city: z.string().trim().optional(),
  couponCode: z.string().trim().optional(),
});
