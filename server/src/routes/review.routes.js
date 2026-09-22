import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { createReviewSchema } from '../validators/review.validators.js';

const router = Router();

router.get('/product/:productId', reviewController.listProductReviews);
router.post('/', protect, validate(createReviewSchema), reviewController.createReview);
router.get('/admin/all', protect, restrictTo('admin', 'super-admin'), reviewController.listAllReviews);
router.patch(
  '/:id/status',
  protect,
  restrictTo('admin', 'super-admin'),
  reviewController.setReviewStatus
);

export default router;
