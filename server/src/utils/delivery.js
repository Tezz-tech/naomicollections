import DeliveryZone from '../models/DeliveryZone.js';
import { getSettings } from '../models/Setting.js';
import { ApiError } from '../middleware/errorHandler.js';

export async function resolveDelivery(state, city, subtotal) {
  const zone = await DeliveryZone.findOne({ state, isActive: true });
  if (!zone) throw new ApiError(400, `Delivery is not currently available to ${state}.`);

  const override = city ? zone.cityOverrides.find((c) => c.name.toLowerCase() === city.toLowerCase()) : null;
  const fee = override?.fee ?? zone.fee;
  const minDays = override?.minDays ?? zone.minDays;
  const maxDays = override?.maxDays ?? zone.maxDays;

  const settings = await getSettings();
  const freeDelivery = subtotal >= settings.freeDeliveryThreshold;

  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + maxDays);

  return {
    zone,
    deliveryFee: freeDelivery ? 0 : fee,
    minDays,
    maxDays,
    estimatedDeliveryDate,
    freeDeliveryApplied: freeDelivery,
  };
}
