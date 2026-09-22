const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export function formatNaira(amount) {
  if (amount == null || Number.isNaN(amount)) return '₦0';
  return currencyFormatter.format(amount);
}

export function formatDate(date, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-NG', options).format(new Date(date));
}
