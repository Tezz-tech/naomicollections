import { Router } from 'express';
import * as controller from '../controllers/deliveryZone.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { upsertDeliveryZoneSchema } from '../validators/deliveryZone.validators.js';

const router = Router();

router.get('/', controller.listPublicZones);

router.use(protect, restrictTo('admin', 'super-admin'));
router.get('/admin', controller.listAdminZones);
router.put('/', validate(upsertDeliveryZoneSchema), controller.upsertZone);
router.delete('/:id', controller.deleteZone);

export default router;
