// All 36 states + the FCT. Lagos gets the fastest/cheapest tier, the
// immediate south-west neighbours a middle tier, everywhere else the
// standard nationwide tier — matches the "Lagos 1-2 days, others 3-5 days"
// example in the brief.
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
  'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'FCT',
];

const NEAR_LAGOS = new Set(['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti', 'FCT']);

export function buildDeliveryZoneSeed() {
  return NIGERIAN_STATES.map((state) => {
    if (state === 'Lagos') {
      return { state, fee: 2500, minDays: 1, maxDays: 2, isActive: true };
    }
    if (NEAR_LAGOS.has(state)) {
      return { state, fee: 3500, minDays: 2, maxDays: 3, isActive: true };
    }
    return { state, fee: 4500, minDays: 3, maxDays: 5, isActive: true };
  });
}
