import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { mockCustomers, mockSales, mockSuppliers } from './initialData';
import { generatePurchaseInvoiceNumber, generateSupplierInvoiceSeries } from '../utils/invoiceGenerator';
import { formatDateForDisplay } from '../utils/dateUtils';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Customers State
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : mockCustomers;
  });

  // Sales State
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('sales');
    return saved ? JSON.parse(saved) : mockSales;
  });

  // Suppliers State
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('suppliers');
    return saved ? JSON.parse(saved) : mockSuppliers;
  });

  // Fix: Change 'purchases' to 'purchase' to match what the forms are using
  const [purchase, setPurchase] = useState(() => {
    const saved = localStorage.getItem('purchase');
    return saved ? JSON.parse(saved) : [];
  });

  // Add rate history state
  const [rateHistory, setRateHistory] = useState(() => {
    const saved = localStorage.getItem('rateHistory');
    return saved ? JSON.parse(saved) : {};
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [customers, sales, suppliers]);

  // Fix: Add specific localStorage effect for purchase
  useEffect(() => {
    localStorage.setItem('purchase', JSON.stringify(purchase));
  }, [purchase]);

  // Add effect to persist rate history
  useEffect(() => {
    localStorage.setItem('rateHistory', JSON.stringify(rateHistory));
  }, [rateHistory]);

  // Add new sale
  const addSale = (saleData) => {
    try {
      setSales(prev => [...prev, { ...saleData, id: Date.now().toString() }]);
      updateInventory(saleData.items);
      toast.success('Sale recorded successfully');
    } catch (error) {
      toast.error('Failed to record sale');
      console.error('Sale error:', error);
    }
  };

  // Add new customer
  const addCustomer = (customerData) => {
    try {
      setCustomers(prev => [...prev, { 
        ...customerData, 
        id: Date.now().toString(),
        balance: 0,
        ledger: []
      }]);
      toast.success('Customer added successfully');
    } catch (error) {
      toast.error('Failed to add customer');
      console.error('Customer error:', error);
    }
  };

  // Add new supplier
  const addSupplier = (supplierData) => {
    try {
      setSuppliers(prev => [...prev, {
        ...supplierData,
        id: Date.now().toString(),
        balance: 0,
        ledger: []
      }]);
      toast.success('Supplier added successfully');
    } catch (error) {
      toast.error('Failed to add supplier');
      console.error('Supplier error:', error);
    }
  };

  // Add updateRates function
  const updateRates = (date, productRates) => {
    setRateHistory(prev => ({
      ...prev,
      [date]: productRates
    }));
  };

  const addSupplierPayment = (supplierId, paymentData) => {
    try {
      setPurchase(prev => {
        const updated = prev.map(purchase => {
          if (purchase.supplierId === supplierId) {
            const newPaymentHistory = [...purchase.paymentHistory, paymentData];
            const totalPaid = newPaymentHistory.reduce((sum, p) => sum + p.amount, 0);
            const remainingAmount = purchase.totalAmount - totalPaid;
            
            return {
              ...purchase,
              paymentHistory: newPaymentHistory,
              remainingAmount,
              status: remainingAmount <= 0 ? 'PAID' : 
                     totalPaid > 0 ? 'PARTIAL' : 'UNPAID'
            };
          }
          return purchase;
        });
        return updated;
      });

      setSuppliers(prev => {
        return prev.map(supplier => {
          if (supplier.id === supplierId) {
            const transactions = [...supplier.transactions, {
              date: paymentData.date,
              description: `Payment - ${paymentData.paymentMethod}`,
              credit: paymentData.amount,
              debit: 0,
              balance: calculateBalance([...supplier.transactions, paymentData])
            }];
            return { ...supplier, transactions };
          }
          return supplier;
        });
      });

      toast.success('Payment recorded successfully');
    } catch (error) {
      toast.error('Failed to record payment');
      console.error(error);
    }
  };

  // Fix: Simplify purchase order creation
  const addPurchaseOrder = (orderData) => {
    try {
      const newOrder = {
        ...orderData,
        id: Date.now().toString(),
        status: orderData.initialPayment >= orderData.totalAmount ? 'paid' : 
                orderData.initialPayment > 0 ? 'partial' : 'unpaid'
      };

      setPurchase(prev => [...prev, newOrder]);
      toast.success('Purchase order created successfully');
    } catch (error) {
      console.error('Purchase creation error:', error);
      toast.error('Failed to create purchase order');
    }
  };

  // Fix: Add missing addPurchase function
  const validatePurchaseData = (data) => {
    if (!data.supplier || !data.date || !data.items || data.items.length === 0) {
      throw new Error('Missing required fields');
    }

    // Validate items
    data.items.forEach((item, index) => {
      if (!item.productName || !item.bagSize || !item.quantity || !item.pricePerQuintal) {
        throw new Error(`Incomplete details for item #${index + 1}`);
      }
    });

    // Validate amounts
    if (data.initialPayment && data.initialPayment > data.totalAmount) {
      throw new Error('Initial payment cannot exceed total amount');
    }

    return true;
  };

  const addPurchase = (purchaseData) => {
    try {
      // Validate the data
      if (!purchaseData.supplier || !purchaseData.date || !purchaseData.items) {
        throw new Error('Missing required fields');
      }

      // Ensure all required fields are present in items
      purchaseData.items.forEach((item, index) => {
        if (!item.productName || !item.bagSize || !item.quantity || !item.pricePerQuintal) {
          throw new Error(`Incomplete details for item #${index + 1}`);
        }
      });

      const formattedPurchase = {
        ...purchaseData,
        id: Date.now().toString(),
        date: formatDateForDisplay(purchaseData.date),
        totalAmount: parseFloat(purchaseData.totalAmount),
        initialPayment: parseFloat(purchaseData.initialPayment) || 0,
        status: purchaseData.status
      };

      setPurchase(prev => [...prev, formattedPurchase]);
      toast.success('Purchase order created successfully');
    } catch (error) {
      console.error('Purchase creation error:', error);
      toast.error(error.message || 'Failed to create purchase order');
      throw error;
    }
  };

  const updatePurchase = (id, updates) => {
    try {
      setPurchase(prev => 
        prev.map(purchase => {
          if (purchase.id === id) {
            const updatedPurchase = { ...purchase, ...updates };
            
            // Recalculate status if payment is updated
            if (updates.paymentHistory) {
              const totalPaid = updates.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
              updatedPurchase.status = totalPaid >= purchase.totalAmount ? 'paid' : 
                                     totalPaid > 0 ? 'partial' : 'unpaid';
              updatedPurchase.remainingAmount = purchase.totalAmount - totalPaid;
            }
            
            return updatedPurchase;
          }
          return purchase;
        })
      );
      toast.success('Purchase order updated successfully');
    } catch (error) {
      toast.error('Failed to update purchase order');
      throw error;
    }
  };

  const value = {
    customers,
    setCustomers,
    sales,
    setSales,
    suppliers,
    setSuppliers,
    purchase, // Fix: Change from 'purchases' to 'purchase'
    setPurchase, // Fix: Change from 'setPurchases' to 'setPurchase'
    addSale,
    addCustomer,
    addSupplier,
    rateHistory,
    updateRates,
    addSupplierPayment,
    addPurchase,
    addPurchaseOrder: addPurchase, // Keep for backward compatibility
    updatePurchase
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Helper function to calculate running balance
const calculateBalance = (transactions) => {
  return transactions.reduce((balance, t) => {
    return balance + (t.debit || 0) - (t.credit || 0);
  }, 0);
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
