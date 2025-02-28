// Generate invoice number only when explicitly called (like during an order creation)
export function generateInvoiceNumber() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateKey = `${day}${month}`; // DDMM format
  const counterKey = `invoiceCounter_${dateKey}`;
  
  // Check and reset counter on day change
  const lastDateKey = localStorage.getItem('lastInvoiceDate');
  if (lastDateKey !== dateKey) {
    localStorage.setItem('lastInvoiceDate', dateKey);
    localStorage.setItem(counterKey, '-1'); // Start at -1 so first increment gives 00
  }
  
  let counter = parseInt(localStorage.getItem(counterKey) || '-1', 10);
  counter++; // Increment for new order (if already called, it won’t be re-called unless order is confirmed)
  localStorage.setItem(counterKey, counter.toString());
  
  const counterStr = String(counter).padStart(2, '0');
  return `${dateKey}${counterStr}`; // e.g., 230200, 230201, etc.
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
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateKey = `${day}${month}`;
  const counterKey = `invoiceCounter_${dateKey}`;
  
  let counter = parseInt(localStorage.getItem(counterKey) || '-1', 10);
  return `${dateKey}${String(counter + 1).padStart(2, '0')}`;
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
