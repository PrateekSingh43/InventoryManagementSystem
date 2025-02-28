export const mockSales = [];
export const mockCustomers = [];

export const mockSuppliers = [
  {
    id: '1',
    name: 'Balgaria Food LLP',
    address: 'Sample Address',
    contact: '1234567890',
    openingBalance: 0,
    transactions: []
  }
];

export const DEFAULT_SUPPLIER = {
  name: '',
  address: '',
  contact: '',
  openingBalance: 0,
  transactions: []
};

export const DEFAULT_PURCHASE_ORDER = {
  supplierId: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  invoiceNumber: '',
  products: [],
  totalAmount: 0,
  initialPayment: 0,
  paymentHistory: [],
  remainingAmount: 0,
  status: 'UNPAID'
};

export const mockPurchases = [];
