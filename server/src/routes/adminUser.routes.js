import { Router } from 'express';
import * as controller from '../controllers/adminUser.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { createAdminSchema, updateAdminSchema } from '../validators/adminUser.validators.js';

const router = Router();

router.use(protect, restrictTo('super-admin'));

router.get('/', controller.listAdmins);
router.post('/', validate(createAdminSchema), controller.createAdmin);
router.patch('/:id', validate(updateAdminSchema), controller.updateAdmin);
router.delete('/:id', controller.deleteAdmin);

export default router;
