import crypto from 'crypto';
import { env } from '../config/env.js';

const BASE_URL = 'https://api.paystack.co';

async function paystackFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.paystack.secretKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!res.ok || json.status === false) {
    throw new Error(json.message || 'Paystack request failed');
  }
  return json;
}

export async function initializeTransaction({ email, amountKobo, reference, callbackUrl, metadata }) {
  const json = await paystackFetch('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });
  return json.data; // { authorization_url, access_code, reference }
}

export async function verifyTransaction(reference) {
  const json = await paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`);
  return json.data; // { status, amount, currency, channel, paid_at, customer, ... }
}

export function verifyWebhookSignature(rawBody, signatureHeader) {
  if (!signatureHeader) return false;
  const hash = crypto
    .createHmac('sha512', env.paystack.secretKey)
    .update(rawBody)
    .digest('hex');
  return hash === signatureHeader;
}

export function nairaToKobo(naira) {
  return Math.round(naira * 100);
}
