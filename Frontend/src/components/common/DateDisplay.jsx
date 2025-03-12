import React from 'react';
import { format } from 'date-fns';

const DateDisplay = ({ date, className = '' }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd-MM-yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <span className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      {formatDate(date)}
    </span>
  );
};

export default DateDisplay;
