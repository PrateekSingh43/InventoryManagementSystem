import React from 'react';
import { Search } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, onClear }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.search}
            placeholder="Search by supplier, invoice number or product..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filters.status}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => onFilterChange({ status: e.target.value })}
          >
            <option value="">Payment Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
          </select>
          
          <select
            value={filters.dateRange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => onFilterChange({ dateRange: e.target.value })}
          >
            <option value="">Time Period</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
