import React from 'react';
import { format } from 'date-fns';

const DateInput = ({ value, onChange, className, ...props }) => {
  // Convert date to yyyy-mm-dd for input
  const formatForInput = (date) => {
    try {
      if (!date) return '';
      const d = new Date(date);
      return format(d, 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  // Convert date to dd-mm-yyyy for storage
  const formatForStorage = (dateString) => {
    try {
      if (!dateString) return '';
      const d = new Date(dateString);
      return format(d, 'dd-MM-yyyy');
    } catch {
      return '';
    }
  };

  return (
    <input
      type="date"
      value={formatForInput(value)}
      onChange={(e) => onChange(formatForStorage(e.target.value))}
      className={className}
      {...props}
    />
  );
};

export default DateInput;
