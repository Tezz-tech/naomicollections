import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import mongoose from 'mongoose';

import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import DeliveryZone from '../models/DeliveryZone.js';
import Setting from '../models/Setting.js';
import Banner from '../models/Banner.js';

import { categoriesSeed, productsSeed, bannersSeed } from './data.js';
import { buildDeliveryZoneSeed } from './nigeriaStates.js';

async function run() {
  await connectDB();

  console.log('[seed] Clearing existing catalog + delivery zone data...');
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    DeliveryZone.deleteMany({}),
    Banner.deleteMany({}),
  ]);

  console.log('[seed] Creating categories...');
  const categories = await Category.insertMany(categoriesSeed);
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  console.log('[seed] Creating products...');
  const products = productsSeed.map(({ categorySlug, ...rest }) => ({
    ...rest,
    category: categoryBySlug[categorySlug],
  }));
  await Product.insertMany(products);

  console.log('[seed] Creating Nigerian delivery zones...');
  await DeliveryZone.insertMany(buildDeliveryZoneSeed());

  console.log('[seed] Creating hero banners...');
  await Banner.insertMany(bannersSeed);

  console.log('[seed] Ensuring default store settings...');
  const existingSettings = await Setting.findOne();
  if (!existingSettings) {
    await Setting.create({
      announcementBar: {
        text: 'Free delivery in Lagos on orders above ₦100,000',
        isActive: true,
      },
    });
  }

  console.log('[seed] Ensuring super-admin account...');
  const existingAdmin = await User.findOne({ email: env.superAdmin.email });
  if (!existingAdmin) {
    await User.create({
      name: env.superAdmin.name,
      email: env.superAdmin.email,
      password: env.superAdmin.password,
      role: 'super-admin',
      isVerified: true,
    });
    console.log(`[seed] Super-admin created: ${env.superAdmin.email} / (password from .env)`);
  } else {
    console.log('[seed] Super-admin already exists, skipping.');
  }

  console.log('[seed] Done.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
