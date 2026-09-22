import { Router } from 'express';
import * as controller from '../controllers/payment.controller.js';
import { paymentLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/initialize', paymentLimiter, controller.initializePayment);
router.get('/verify/:reference', paymentLimiter, controller.verifyPayment);

export default router;
