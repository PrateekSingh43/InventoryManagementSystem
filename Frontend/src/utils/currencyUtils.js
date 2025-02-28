export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return '₹0';
  return `₹${parseFloat(value).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`;
};

export const parseCurrency = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(/[₹,]/g, '')) || 0;
};
