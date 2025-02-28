import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export const calculateLedgerTotals = (transactions) => {
  return transactions.reduce((acc, curr) => ({
    totalDebit: acc.totalDebit + (curr.debit || 0),
    totalCredit: acc.totalCredit + (curr.credit || 0),
    balance: curr.balance
  }), { totalDebit: 0, totalCredit: 0, balance: 0 });
};

export const filterTransactionsByDate = (transactions, dateRange) => {
  if (!dateRange[0] || !dateRange[1]) return transactions;

  const startDate = startOfDay(new Date(dateRange[0]));
  const endDate = endOfDay(new Date(dateRange[1]));

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, { start: startDate, end: endDate });
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};
