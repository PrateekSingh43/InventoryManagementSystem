// Consolidated helper functions
export const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV${year}${month}${day}${random}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const getStatusColor = (status) => {
  const colors = {
    PAID: 'bg-green-100 text-green-800',
    PARTIAL: 'bg-yellow-100 text-yellow-800',
    UNPAID: 'bg-red-100 text-red-800',
    PENDING: 'bg-orange-100 text-orange-800'
  };
  return colors[status?.toUpperCase()] || 'bg-gray-100 text-gray-800';
};

export const calculateBalance = (transactions = []) => {
  return transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
};
