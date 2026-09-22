import { Router } from 'express';
import { z } from 'zod';
import * as productController from '../controllers/product.controller.js';
import { requestNotification } from '../controllers/stockNotification.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo, attachUserIfPresent } from '../middleware/auth.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from '../validators/product.validators.js';

const router = Router();

const notifyMeSchema = z.object({
  email: z.string().trim().email(),
  variantSku: z.string().optional(),
});

router.get(
  '/',
  attachUserIfPresent,
  validate(listProductsQuerySchema, 'query'),
  productController.listProducts
);

router.get(
  '/admin/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  productController.getAdminProduct
);

router.get('/:slug', attachUserIfPresent, productController.getProduct);
router.get('/:slug/related', productController.getRelatedProducts);
router.post('/:productId/notify-me', validate(notifyMeSchema), requestNotification);

router.use(protect, restrictTo('admin', 'super-admin'));
router.post('/', validate(createProductSchema), productController.createProduct);
router.patch('/:id', validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
