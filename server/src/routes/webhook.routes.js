import { Router } from 'express';
import express from 'express';
import { verifyWebhookSignature } from '../services/paystack.service.js';
import { finalizePaidOrder, markPaymentFailed } from '../services/fulfillment.service.js';

const router = Router();

// Mounted in app.js with express.raw() (before the global json() parser) so
// req.body here is the exact raw Buffer the HMAC signature was computed over.
router.post(
  '/paystack',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['x-paystack-signature'];
    const rawBody = req.body;

    if (!verifyWebhookSignature(rawBody, signature)) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    // Ack immediately — Paystack retries on non-2xx/timeout, and our finalize
    // step is idempotent, so we can safely process after responding.
    res.status(200).json({ received: true });

    let event;
    try {
      event = JSON.parse(rawBody.toString('utf8'));
    } catch {
      return;
    }

    try {
      if (event.event === 'charge.success') {
        await finalizePaidOrder({ reference: event.data.reference, gatewayData: event.data });
      } else if (event.event === 'charge.failed') {
        await markPaymentFailed({ reference: event.data.reference, gatewayData: event.data });
      }
    } catch (err) {
      console.error('[webhook] paystack processing failed:', err.message);
    }
  }
);

export default router;
