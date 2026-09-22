import { Router } from 'express';
import * as controller from '../controllers/order.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo, attachUserIfPresent } from '../middleware/auth.middleware.js';
import { createOrderSchema, quoteSchema } from '../validators/order.validators.js';
import {
  updateOrderStatusSchema,
  updateEstimatedDeliverySchema,
  addTrackingNoteSchema,
} from '../validators/adminOrder.validators.js';

const router = Router();

router.post('/quote', validate(quoteSchema), controller.getQuote);
router.post('/', attachUserIfPresent, validate(createOrderSchema), controller.createOrder);
router.get('/mine', protect, controller.listMyOrders);

router.get('/admin/all', protect, restrictTo('admin', 'super-admin'), controller.listAllOrders);
router.get('/admin/:id', protect, restrictTo('admin', 'super-admin'), controller.getAdminOrder);
router.patch(
  '/admin/:id/status',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(updateOrderStatusSchema),
  controller.updateOrderStatus
);
router.patch(
  '/admin/:id/delivery-date',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(updateEstimatedDeliverySchema),
  controller.updateEstimatedDelivery
);
router.post(
  '/admin/:id/tracking-notes',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(addTrackingNoteSchema),
  controller.addTrackingNote
);

router.get('/:orderNumber', attachUserIfPresent, controller.getOrderByNumber);

export default router;
