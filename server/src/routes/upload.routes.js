import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { getUploadSignature, deleteImage } from '../controllers/upload.controller.js';

const router = Router();

router.use(protect, restrictTo('admin', 'super-admin'));
router.get('/signature', getUploadSignature);
router.delete('/', deleteImage);

export default router;
