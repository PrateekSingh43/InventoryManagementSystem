import React from 'react';
import { useAppContext } from '../../context/AppContext';

const TotalCreditSummary = () => {
  const { purchase = [] } = useAppContext(); // Add default empty array
  
  const totalCredit = (purchase || []).reduce((sum, order) => {
    return sum + (order?.remainingAmount || 0);
  }, 0);
  
  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 max-w-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Total Credit: ₹{totalCredit.toLocaleString()}
      </h2>
    </div>
  );
};

export default TotalCreditSummary;
