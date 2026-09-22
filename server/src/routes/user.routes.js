import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.middleware.js';
import { updateProfileSchema, addressSchema } from '../validators/auth.validators.js';

const router = Router();

router.use(protect);

router.patch('/profile', validate(updateProfileSchema), controller.updateProfile);

router.post('/addresses', validate(addressSchema), controller.addAddress);
router.patch('/addresses/:addressId', validate(addressSchema.partial()), controller.updateAddress);
router.delete('/addresses/:addressId', controller.deleteAddress);

router.get('/wishlist', controller.getWishlist);
router.post('/wishlist/:productId', controller.toggleWishlist);

export default router;
