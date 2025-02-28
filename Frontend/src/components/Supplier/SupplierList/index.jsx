import React from 'react';
import { ArrowRight } from 'lucide-react';

const SupplierList = ({ suppliers, onSelect }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <div 
          key={supplier.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelect(supplier)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {supplier.name}
              </h3>
              {supplier.address && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {supplier.address}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Contact: {supplier.contact || 'N/A'}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Opening Balance
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{supplier.openingBalance?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>
      ))}

      {suppliers.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No suppliers found. Add your first supplier to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
