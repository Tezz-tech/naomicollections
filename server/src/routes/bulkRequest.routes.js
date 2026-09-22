import { Router } from 'express';
import * as controller from '../controllers/bulkRequest.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo, attachUserIfPresent } from '../middleware/auth.middleware.js';
import { createBulkRequestSchema } from '../validators/bulkRequest.validators.js';
import { quoteResponseSchema, convertToOrderSchema } from '../validators/adminBulkRequest.validators.js';

const router = Router();

router.post('/', attachUserIfPresent, validate(createBulkRequestSchema), controller.createBulkRequest);
router.get('/mine', protect, controller.listMyBulkRequests);

router.get('/admin/all', protect, restrictTo('admin', 'super-admin'), controller.listAllBulkRequests);
router.post(
  '/admin/:id/quote',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(quoteResponseSchema),
  controller.respondWithQuote
);
router.post(
  '/admin/:id/convert',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(convertToOrderSchema),
  controller.convertToOrder
);
router.patch('/admin/:id/close', protect, restrictTo('admin', 'super-admin'), controller.closeBulkRequest);

router.get('/:id', protect, controller.getBulkRequest);

export default router;
