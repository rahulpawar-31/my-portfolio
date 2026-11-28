export const demoVehicles = [
  { id: "city", name: "City hatchback", daily: 1800, deposit: 1500 },
  { id: "sedan", name: "Comfort sedan", daily: 3200, deposit: 2000 },
  { id: "suv", name: "Weekend SUV", daily: 5500, deposit: 3000 },
];

export const demoCoupons = {
  none: { label: "No coupon", type: "flat", value: 0 },
  welcome10: { label: "WELCOME10 · 10% off", type: "percentage", value: 10 },
  save500: { label: "SAVE500 · ₹500 off", type: "flat", value: 500 },
};

// Browser-only demonstration of the public project's pricing rules. This is
// deliberately separate from the real booking API and uses sample car rates.
export function calculateDemoQuote({ vehicleId, rentalType, duration, couponId }) {
  const vehicle = demoVehicles.find((item) => item.id === vehicleId);
  const coupon = demoCoupons[couponId];
  const quantity = Number(duration);
  const max = rentalType === "hour" ? 24 : 30;
  if (!vehicle || !coupon || !["day", "hour", "airport"].includes(rentalType)) return null;
  if (rentalType !== "airport" && (!Number.isInteger(quantity) || quantity < 1 || quantity > max)) return null;

  const rate = rentalType === "hour" ? Math.round(vehicle.daily / 8) : vehicle.daily;
  const base = rentalType === "airport" ? Math.round(vehicle.daily * 0.4) : rate * quantity;
  const discount = Math.min(base, coupon.type === "percentage" ? base * coupon.value / 100 : coupon.value);
  const tax = Math.round((base - discount) * 0.18);
  return { base, discount, tax, deposit: vehicle.deposit, total: base - discount + tax + vehicle.deposit };
}

export const formatRupees = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(amount);
