import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';

const DatePicker = ({ value, onChange, placeholder }) => {
  const [showPicker, setShowPicker] = useState(false);

  // For display - visible input (dd-MM-yyyy)
  const displayValue = value ? format(new Date(value), 'dd-MM-yyyy') : '';

  // For hidden native picker (yyyy-MM-dd)
  const getNativeValue = () => {
    if (!value) return '';
    try {
      return format(new Date(value), 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  const handleDateChange = (e) => {
    const nativeDate = e.target.value; // yyyy-MM-dd
    if (nativeDate) {
      const date = new Date(nativeDate);
      onChange(date);
    }
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full border rounded-lg px-3 py-2 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        placeholder={placeholder || 'dd-MM-yyyy'}
        value={displayValue}
        readOnly
        onClick={() => setShowPicker(true)}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        onClick={() => setShowPicker(true)}
      >
        <Calendar className="h-5 w-5" />
      </button>
      {showPicker && (
        <input
          type="date"
          className="absolute inset-0 opacity-0 cursor-pointer"
          value={getNativeValue()}
          onChange={handleDateChange}
          onBlur={() => setShowPicker(false)}
          autoFocus
        />
      )}
    </div>
  );
};

export default DatePicker;
