export const mockProducts = [
  {
    id: '1',
    name: 'Rice',
    variants: [
      { id: '1-1', bagSize: 25, currentStock: 100, minimumStock: 50 }
    ]
  }
];

export const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    type: 'regular',
    phone: '1234567890'
  }
];

export const mockSales = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    customerName: 'John Doe',
    date: new Date().toISOString(),
    totalAmount: 5000,
    status: 'PAID'
  }
];
