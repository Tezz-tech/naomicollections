import { Router } from 'express';
import * as controller from '../controllers/coupon.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
} from '../validators/coupon.validators.js';

const router = Router();

router.post('/validate', validate(validateCouponSchema), controller.validateCoupon);

router.use(protect, restrictTo('admin', 'super-admin'));
router.get('/', controller.listCoupons);
router.post('/', validate(createCouponSchema), controller.createCoupon);
router.patch('/:id', validate(updateCouponSchema), controller.updateCoupon);
router.delete('/:id', controller.deleteCoupon);

export default router;
