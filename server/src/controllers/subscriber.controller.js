import Subscriber from '../models/Subscriber.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middleware/errorHandler.js';

export const subscribe = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError(400, 'Enter a valid email address.');
  }

  const existing = await Subscriber.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true;
      await existing.save();
    }
    return res.json({ success: true, message: "You're already on the list." });
  }

  await Subscriber.create({ email: email.toLowerCase() });
  res.status(201).json({ success: true, message: 'Subscribed! Watch your inbox for updates.' });
});
