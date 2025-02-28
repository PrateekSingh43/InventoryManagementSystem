import React from 'react';
import { useAppContext } from '../../context/AppContext';


const SupplierLedger = ({ supplier }) => {
  const { addSupplierPayment } = useAppContext();

  // Transform transactions for display
  const transformedTransactions = supplier.transactions.map(t => ({
    ...t,
    formattedDate: new Date(t.date).toLocaleDateString(),
    amount: t.debit || t.credit,
    type: t.debit ? 'DEBIT' : 'CREDIT'
  }));

  return (
    <LedgerView
      entity={supplier}
      type="supplier"
      transactions={transformedTransactions}
      onAddPayment={(payment) => addSupplierPayment(supplier.id, payment)}
    />
  );
};

export default SupplierLedger;
