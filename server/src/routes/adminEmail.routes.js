import { Router } from 'express';
import * as controller from '../controllers/adminEmail.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { composeEmailSchema, newsletterSchema } from '../validators/adminEmail.validators.js';

const router = Router();

router.use(protect, restrictTo('admin', 'super-admin'));

router.get('/logs', controller.listEmailLogs);
router.post('/compose', validate(composeEmailSchema), controller.composeEmail);
router.get('/subscribers', controller.listSubscribers);
router.post('/newsletter', validate(newsletterSchema), controller.sendNewsletter);
router.post('/abandoned-cart-reminders', controller.runAbandonedCartReminders);

export default router;
