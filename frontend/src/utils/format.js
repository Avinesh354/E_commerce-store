// Ratings, reviews and discounts are sample data for this demo store.
// They are worked out from the product id so they stay the same on every visit.

export const rupees = (value) =>
  "₹" + Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const DISCOUNTS = [10, 12, 15, 18, 20, 25, 30, 35, 40];

export const demoMrp = (price, id) => {
  const discount = DISCOUNTS[id % DISCOUNTS.length];
  return Math.ceil(Number(price) / (1 - discount / 100) / 10) * 10;
};

export const offPercent = (price, id) =>
  Math.round((1 - Number(price) / demoMrp(price, id)) * 100);

export const demoRating = (id) => (3.8 + ((id * 7) % 12) / 10).toFixed(1);

export const demoReviews = (id) => 120 + ((id * 937) % 4800);
