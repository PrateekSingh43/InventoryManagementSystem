import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';

const TotalCreditSummary = () => {
  const { purchase = [] } = useAppContext();
  
  const totalCredit = useMemo(() => {
    return purchase.reduce((total, order) => {
      const remainingAmount = order.remainingAmount || 0;
      return total + remainingAmount;
    }, 0);
  }, [purchase]);
  
  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Outstanding
          </h3>
          <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">
            ₹{totalCredit.toLocaleString()}
          </p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {purchase.length} orders
        </p>
      </div>
    </div>
  );
};

export default TotalCreditSummary;
