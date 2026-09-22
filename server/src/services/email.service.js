import { env } from '../config/env.js';
import EmailLog from '../models/EmailLog.js';

let nodemailerTransporter = null;

async function sendViaResend({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.email.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: env.email.from, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Resend request failed (${res.status})`);
  }
}

async function sendViaSmtp({ to, subject, html }) {
  if (!nodemailerTransporter) {
    const nodemailer = await import('nodemailer');
    nodemailerTransporter = nodemailer.default.createTransport({
      host: env.email.smtpHost,
      port: env.email.smtpPort,
      secure: env.email.smtpPort === 465,
      auth: env.email.smtpUser ? { user: env.email.smtpUser, pass: env.email.smtpPass } : undefined,
    });
  }
  await nodemailerTransporter.sendMail({ from: env.email.from, to, subject, html });
}

// Branded HTML wrapper shared by every transactional/marketing email.
export function wrapBrandedEmail({ heading, bodyHtml, ctaText, ctaUrl }) {
  return `
  <div style="background:#F7F5F0;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E5E5;">
      <div style="background:#0A0A0A;padding:24px;text-align:center;">
        <span style="color:#FFFFFF;font-size:20px;letter-spacing:2px;">NAOMI'S</span><br/>
        <span style="color:#C9A45C;font-size:11px;letter-spacing:4px;">COLLECTIONS</span>
      </div>
      <div style="padding:32px;font-family:Helvetica,Arial,sans-serif;color:#0A0A0A;">
        <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;">${heading}</h1>
        <div style="font-size:14px;line-height:1.6;color:#333;">${bodyHtml}</div>
        ${
          ctaText && ctaUrl
            ? `<a href="${ctaUrl}" style="display:inline-block;margin-top:24px;padding:14px 28px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">${ctaText}</a>`
            : ''
        }
      </div>
      <div style="padding:20px;text-align:center;border-top:1px solid #E5E5E5;">
        <span style="font-size:11px;color:#6B6B6B;font-family:Helvetica,Arial,sans-serif;">
          Naomi's Collections — Curated for the way you want to be seen.
        </span>
      </div>
    </div>
  </div>`;
}

export async function sendEmail({ to, subject, html, type, relatedOrder = null, relatedUser = null }) {
  const usingResend = env.email.provider === 'resend' && env.email.resendApiKey;
  const usingSmtp = env.email.provider === 'smtp' && env.email.smtpHost && env.email.smtpUser;

  try {
    if (usingResend) {
      await sendViaResend({ to, subject, html });
    } else if (usingSmtp) {
      await sendViaSmtp({ to, subject, html });
    } else {
      console.log(`[email] No provider configured — skipping send. Would have sent "${subject}" to ${to}`);
    }
    await EmailLog.create({ to, subject, type, status: 'sent', relatedOrder, relatedUser });
  } catch (err) {
    console.error('[email] send failed:', err.message);
    await EmailLog.create({
      to,
      subject,
      type,
      status: 'failed',
      error: err.message,
      relatedOrder,
      relatedUser,
    });
  }
}
