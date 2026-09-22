import { Router } from 'express';
import * as controller from '../controllers/setting.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { updateSettingsSchema } from '../validators/setting.validators.js';

const router = Router();

router.get('/', controller.getPublicSettings);

router.use(protect, restrictTo('admin', 'super-admin'));
router.get('/admin', controller.getAdminSettings);
router.patch('/admin', validate(updateSettingsSchema), controller.updateSettings);

export default router;
