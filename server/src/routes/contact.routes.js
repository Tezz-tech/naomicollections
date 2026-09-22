import { Router } from 'express';
import { z } from 'zod';
import { submitContactForm } from '../controllers/contact.controller.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = Router();

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  subject: z.string().trim().min(2),
  message: z.string().trim().min(4).max(2000),
});

router.post('/', authLimiter, validate(schema), submitContactForm);

export default router;
