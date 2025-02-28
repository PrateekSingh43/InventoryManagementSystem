import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

const DatePicker = ({ value, onChange, className, label, error }) => {
  // Convert date to Indian format for display
  const formatDateForInput = (date) => {
    try {
      return format(new Date(date), 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="date"
          value={formatDateForInput(value)}
          onChange={(e) => onChange(e.target.value)}
          className={`
            block w-full pr-10 rounded-md border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
            focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
            ${className}
          `}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;
