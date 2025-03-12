import { format } from 'date-fns';

// Generate invoice number only when explicitly called (like during an order creation)
export function generateInvoiceNumber() {
  return getCurrentCounter();
}

// Function to reset counter for current day manually
export const resetDailyCounter = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateKey = `${day}${month}`;
  const counterKey = `invoiceCounter_${dateKey}`;
  
  localStorage.setItem(counterKey, '-1'); // Reset so that next call returns 00
  localStorage.setItem('lastInvoiceDate', dateKey);
};

// Function to check next invoice number without incrementing
export const getCurrentCounter = () => {
  const today = new Date();
  const datePrefix = format(today, 'ddMM'); // Gets current date as ddMM
  
  // Get existing orders for today from localStorage
  const existingPurchases = JSON.parse(localStorage.getItem('purchases') || '[]');
  const todaysPurchases = existingPurchases.filter(purchase => 
    purchase.orderNumber.startsWith(datePrefix)
  );

  // If no purchases today, start from 00
  if (todaysPurchases.length === 0) {
    return `${datePrefix}00`;
  }

  // Get the highest number used today
  const numbers = todaysPurchases.map(purchase => 
    parseInt(purchase.orderNumber.slice(-2))
  );
  const highestNumber = Math.max(...numbers);
  
  // Format new number with leading zero if needed
  const nextNumber = (highestNumber + 1).toString().padStart(2, '0');
  return `${datePrefix}${nextNumber}`;
};

export const generatePurchaseInvoiceNumber = (currentOrders) => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Get today's orders
  const todaysOrders = currentOrders.filter(order => 
    order.purchaseDate.startsWith(`${date.getFullYear()}-${month}-${day}`)
  );

  const counter = (todaysOrders.length + 1).toString().padStart(2, '0');
  return `${day}${month}${counter}`;
};

export const generateSupplierInvoiceSeries = (supplierPrefix, currentCount) => {
  const fiscalYear = getFiscalYear();
  const number = (currentCount + 1).toString().padStart(3, '0');
  return `${supplierPrefix}/${fiscalYear}/${number}`;
};

const getFiscalYear = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const nextYear = year + 1;
  
  return month >= 4 
    ? `${year}-${nextYear.toString().slice(-2)}`
    : `${year-1}-${year.toString().slice(-2)}`;
};

export const getInvoiceNumber = () => {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const storageKey = `invoice_counter_${dateKey}`;
  
  // Check if we need to reset the counter for a new day
  const lastDateKey = localStorage.getItem('last_invoice_date');
  if (lastDateKey !== dateKey) {
    localStorage.setItem('last_invoice_date', dateKey);
    localStorage.setItem(storageKey, '-1'); // Start from -1 so first increment gives 000
  }
  
  // Get and increment counter
  let counter = parseInt(localStorage.getItem(storageKey) || '-1');
  counter = (counter + 1) % 1000; // Reset to 0 after 999
  localStorage.setItem(storageKey, counter.toString());
  
  // Format as three digits
  return counter.toString().padStart(3, '0');
};
