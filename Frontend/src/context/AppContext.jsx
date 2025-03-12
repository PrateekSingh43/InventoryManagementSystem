import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts } from '../data/productlist';

const AppContext = createContext(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  const [products] = useState(defaultProducts);
  
  // Load purchases from localStorage silently
  const [purchase, setPurchase] = useState(() => {
    try {
      const savedPurchases = localStorage.getItem('purchases');
      return savedPurchases ? JSON.parse(savedPurchases).map(p => ({
        ...p,
        date: new Date(p.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      })) : [];
    } catch {
      return [];
    }
  });

  // Add state for current item calculations
  const [currentItemCalc, setCurrentItemCalc] = useState({
    totalWeight: 0,
    totalPrice: 0
  });

  // Helper function for calculating current item totals
  const calculateItemTotals = (quantity, bagSize, price) => {
    const weight = quantity * bagSize;
    const totalPrice = quantity * price;
    return { totalWeight: weight, totalPrice };
  };

  // Load suppliers silently
  const [suppliers, setSuppliers] = useState(() => {
    try {
      const savedSuppliers = localStorage.getItem('suppliers');
      return savedSuppliers ? JSON.parse(savedSuppliers) : [];
    } catch {
      return [];
    }
  });

  // Silent localStorage saves
  useEffect(() => {
    try {
      localStorage.setItem('suppliers', JSON.stringify(suppliers));
    } catch {}
  }, [suppliers]);

  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [rateHistory, setRateHistory] = useState({});

  // Simplified item preview state
  const [itemPreview, setItemPreview] = useState({
    weight: 0,
    price: 0,
    isVisible: false
  });

  // Improved calculation function
  const calculateItemPreview = (bagSize, quantity, pricePerQuintal) => {
    if (!bagSize || !quantity || !pricePerQuintal) {
      setItemPreview({ weight: 0, price: 0, isVisible: false });
      return;
    }

    const weight = parseFloat(bagSize) * parseFloat(quantity);
    const price = (weight / 100) * parseFloat(pricePerQuintal); // Convert to quintals

    setItemPreview({
      weight,
      price,
      isVisible: true
    });
  };

  // Overall order totals
  const [orderTotals, setOrderTotals] = useState({
    totalWeight: 0,
    totalPrice: 0
  });

  // Helper functions for calculations
  const updateOrderTotals = (items) => {
    const totals = items.reduce((acc, item) => ({
      totalWeight: acc.totalWeight + (Number(item.quantity) * Number(item.bagSize)),
      totalPrice: acc.totalPrice + (Number(item.quantity) * Number(item.price))
    }), { totalWeight: 0, totalPrice: 0 });
    setOrderTotals(totals);
  };

  // Silent localStorage saves
  useEffect(() => {
    try {
      localStorage.setItem('purchases', JSON.stringify(purchase));
    } catch {}
  }, [purchase]);

  // Add function to update supplier transactions
  const updateSupplierTransactions = (supplierId, transaction) => {
    setSuppliers(prev => prev.map(supplier => {
      if (supplier.id === supplierId) {
        return {
          ...supplier,
          transactions: [...(supplier.transactions || []), transaction]
        };
      }
      return supplier;
    }));
  };

  const value = {
    products,
    purchase,
    setPurchase: (newPurchases) => {
      const normalizedPurchases = Array.isArray(newPurchases) 
        ? newPurchases.map(p => ({
            ...p,
            date: new Date(p.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          }))
        : newPurchases;
      setPurchase(normalizedPurchases);
    },
    currentItemCalc,
    setCurrentItemCalc,
    calculateItemTotals,
    suppliers,
    setSuppliers,
    updateSupplierTransactions,
    customers,
    setCustomers,
    sales,
    setSales,
    rateHistory,
    setRateHistory,
    itemPreview,
    setItemPreview,
    calculateItemPreview,
    orderTotals,
    updateOrderTotals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
