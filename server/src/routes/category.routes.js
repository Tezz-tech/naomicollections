import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
} from '../validators/category.validators.js';

const router = Router();

router.get('/', categoryController.listCategories);
router.get('/:slug', categoryController.getCategory);

router.use(protect, restrictTo('admin', 'super-admin'));
router.post('/', validate(createCategorySchema), categoryController.createCategory);
router.patch('/reorder', validate(reorderCategoriesSchema), categoryController.reorderCategories);
router.patch('/:id', validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
