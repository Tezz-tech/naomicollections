import { Router } from 'express';
import * as controller from '../controllers/dashboard.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect, restrictTo('admin', 'super-admin'));

router.get('/overview', controller.getOverview);
router.get('/notifications', controller.getNotifications);

router.get('/customers', controller.listCustomers);
router.get('/customers/:id', controller.getCustomer);
router.patch('/customers/:id/block', controller.setCustomerBlocked);

export default router;
