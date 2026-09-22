import { catchAsync } from '../utils/catchAsync.js';
import { sendEmail, wrapBrandedEmail } from '../services/email.service.js';
import { getSettings } from '../models/Setting.js';
import { env } from '../config/env.js';

export const submitContactForm = catchAsync(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const settings = await getSettings();

  await sendEmail({
    to: settings.storeEmail || env.superAdmin.email,
    subject: `Contact Form: ${subject}`,
    type: 'custom',
    html: wrapBrandedEmail({
      heading: 'New Contact Message',
      bodyHtml: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p style="margin-top:12px;">${message.replace(/\n/g, '<br/>')}</p>
      `,
    }),
  });

  res.json({ success: true, message: "Thanks for reaching out — we'll be in touch soon." });
});
