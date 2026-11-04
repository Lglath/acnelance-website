export const catalog = Object.freeze({
  sku: 'ACN-PUR-200', slug: 'purifying-blemish-care-cleanser',
  name: 'Purifying Blemish Care Cleanser',
  vietnameseName: 'Sữa rửa mặt hỗ trợ ngừa mụn cho da dầu mụn',
  size: '200 ml', collection: 'Purifying',
  image: '/assets/hero.webp',
  price: 289000, shippingFee: 30000,
  samplePricing: true, liveOrdersEnabled: false, maximumQuantity: 10
});
export function normalizeQuantity(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(catalog.maximumQuantity, Math.max(0, Math.trunc(number))) : 0;
}
export function readCart(raw) {
  if (!raw || typeof raw !== 'object' || raw.sku !== catalog.sku) return { sku: catalog.sku, quantity: 0 };
  return { sku: catalog.sku, quantity: normalizeQuantity(raw.quantity) };
}
export function totals(quantity) {
  const count = normalizeQuantity(quantity);
  const subtotal = count * catalog.price;
  const shipping = count ? catalog.shippingFee : 0;
  return { quantity: count, subtotal, shipping, total: subtotal + shipping };
}
export function validPhone(value) { return /^(0\d{9}|\+84\d{9})$/.test(String(value).replace(/[\s().-]/g, '')); }
export function money(value) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value); }
