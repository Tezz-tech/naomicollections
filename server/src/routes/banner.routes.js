import { Router } from 'express';
import * as bannerController from '../controllers/banner.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', bannerController.listPublicBanners);

router.use(protect, restrictTo('admin', 'super-admin'));
router.get('/admin', bannerController.listAdminBanners);
router.post('/', bannerController.createBanner);
router.patch('/:id', bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

export default router;
