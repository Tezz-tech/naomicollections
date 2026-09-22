import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { uploadImages, deleteImage } from '../controllers/upload.controller.js';

const router = Router();

router.use(protect, restrictTo('admin', 'super-admin'));
router.post('/', upload.array('images', 10), uploadImages);
router.delete('/', deleteImage);

export default router;
