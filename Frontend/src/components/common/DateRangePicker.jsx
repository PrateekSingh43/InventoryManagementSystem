import React from 'react';
import { format } from 'date-fns';

const DateRangePicker = ({ dateRange, onChange, className }) => {
  const [startDate, endDate] = dateRange || [null, null];

  const handleDateChange = (type, value) => {
    const newRange = [...(dateRange || [null, null])];
    newRange[type === 'start' ? 0 : 1] = value;
    onChange(newRange);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="date"
        value={startDate ? format(new Date(startDate), 'yyyy-MM-dd') : ''}
        onChange={(e) => handleDateChange('start', e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
      <span className="text-gray-500">to</span>
      <input
        type="date"
        value={endDate ? format(new Date(endDate), 'yyyy-MM-dd') : ''}
        onChange={(e) => handleDateChange('end', e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );
};

export default DateRangePicker;
