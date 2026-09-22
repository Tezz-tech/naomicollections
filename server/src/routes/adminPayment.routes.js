import { Router } from 'express';
import { listPayments } from '../controllers/adminPayment.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, restrictTo('admin', 'super-admin'), listPayments);

export default router;
