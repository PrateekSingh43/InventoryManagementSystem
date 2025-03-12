import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

const CustomDateInput = ({ value, onChange, placeholder }) => {
  const [showNativeInput, setShowNativeInput] = useState(false);

  const formatDateForDisplay = (date) => {
    if (!date) return '';
    try {
      return format(new Date(date), 'dd-MM-yyyy');
    } catch {
      return '';
    }
  };

  const handleNativeDateChange = (e) => {
    const nativeDate = e.target.value; // yyyy-MM-dd
    if (nativeDate) {
      const [year, month, day] = nativeDate.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      onChange(formattedDate);
    }
    setShowNativeInput(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full border rounded-lg px-3 py-2 pr-10"
        placeholder={placeholder || 'dd-MM-yyyy'}
        value={formatDateForDisplay(value)}
        readOnly
        onClick={() => setShowNativeInput(true)}
      />
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => setShowNativeInput(true)}
      >
        <Calendar className="h-5 w-5 text-gray-400" />
      </button>
      {showNativeInput && (
        <input
          type="date"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleNativeDateChange}
          onBlur={() => setShowNativeInput(false)}
          autoFocus
        />
      )}
    </div>
  );
};

export default CustomDateInput;
