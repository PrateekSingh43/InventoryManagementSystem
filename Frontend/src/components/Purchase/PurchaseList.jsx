import React, { useMemo, useState } from 'react';
import { format, isToday, isYesterday, isSameWeek, isSameMonth } from 'date-fns';
import PurchaseCard from './PurchaseCard';

const PurchaseList = ({ purchases, onEdit }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredPurchases = useMemo(() => {
    return purchases.filter(purchase => {
      if (statusFilter === 'all') return true;
      return purchase.status === statusFilter;
    });
  }, [purchases, statusFilter]);

  const groupedPurchases = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: []
    };

    filteredPurchases.forEach(purchase => {
      const purchaseDate = new Date(purchase.date);
      
      if (isToday(purchaseDate)) {
        groups.today.push(purchase);
      } else if (isYesterday(purchaseDate)) {
        groups.yesterday.push(purchase);
      } else if (isSameWeek(purchaseDate, new Date())) {
        groups.thisWeek.push(purchase);
      } else if (isSameMonth(purchaseDate, new Date())) {
        groups.thisMonth.push(purchase);
      } else {
        groups.older.push(purchase);
      }
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return groups;
  }, [filteredPurchases]);

  const renderSection = (title, purchases) => {
    if (purchases.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {purchases.map(purchase => (
            <PurchaseCard
              key={purchase.id}
              purchase={purchase}
              onEdit={onEdit}
            />
          ))}
        </div>
      </div>
    );
  };

  const FilterBar = () => (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border-gray-300 text-sm shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <FilterBar />
      {renderSection("Today's Orders", groupedPurchases.today)}
      {renderSection("Yesterday's Orders", groupedPurchases.yesterday)}
      {renderSection("This Week's Orders", groupedPurchases.thisWeek)}
      {renderSection("This Month's Orders", groupedPurchases.thisMonth)}
      {renderSection("Older Orders", groupedPurchases.older)}
      
      {!purchases.length && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No purchase orders found
        </div>
      )}
    </div>
  );
};

export default PurchaseList;
