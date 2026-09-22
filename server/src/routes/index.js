import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminEmailRoutes from './adminEmail.routes.js';
import adminPaymentRoutes from './adminPayment.routes.js';
import adminUserRoutes from './adminUser.routes.js';
import bannerRoutes from './banner.routes.js';
import bulkRequestRoutes from './bulkRequest.routes.js';
import categoryRoutes from './category.routes.js';
import contactRoutes from './contact.routes.js';
import couponRoutes from './coupon.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import deliveryZoneRoutes from './deliveryZone.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';
import productRoutes from './product.routes.js';
import reviewRoutes from './review.routes.js';
import settingRoutes from './setting.routes.js';
import subscriberRoutes from './subscriber.routes.js';
import uploadRoutes from './upload.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: "Welcome to Naomi's Collections API" });
});

router.use('/auth', authRoutes);
router.use('/admin/emails', adminEmailRoutes);
router.use('/admin/payments', adminPaymentRoutes);
router.use('/admin/admins', adminUserRoutes);
router.use('/admin/dashboard', dashboardRoutes);
router.use('/banners', bannerRoutes);
router.use('/bulk-requests', bulkRequestRoutes);
router.use('/categories', categoryRoutes);
router.use('/contact', contactRoutes);
router.use('/coupons', couponRoutes);
router.use('/delivery-zones', deliveryZoneRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/settings', settingRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/uploads', uploadRoutes);
router.use('/users', userRoutes);

export default router;
