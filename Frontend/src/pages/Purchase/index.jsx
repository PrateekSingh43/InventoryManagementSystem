import React, { useState, useMemo } from 'react';
import { Plus, Filter, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import PurchaseForm from '../../components/Purchase/PurchaseForm';
import PurchaseCard from '../../components/Purchase/PurchaseCard';
import FilterBar from '../../components/Purchase/FilterBar';
import TotalCreditSummary from '../../components/Purchase/TotalCreditSummary';
import { formatDisplayDate } from '../../utils/dateUtils';

const Purchase = () => {
  const { purchase } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: ''
  });
  const [isFiltering, setIsFiltering] = useState(false);

  const groupedPurchases = useMemo(() => {
    if (!purchase?.length) return {};

    return purchase.reduce((groups, order) => {
      const dateKey = formatDisplayDate(order.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
      return groups;
    }, {});
  }, [purchase]);

  const handleCreatePurchase = () => {
    setEditingPurchase(null); // Ensure we're in create mode
    setShowForm(true);
  };

  const handleEdit = (order) => {
    setEditingPurchase(order);
    setShowForm(true);
  };

  const handleFilterChange = (newFilters) => {
    setIsFiltering(true);
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    // Add small delay to show loading state
    setTimeout(() => setIsFiltering(false), 300);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateRange: ''
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPurchase(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 relative">
      {/* Credit Summary */}
      <TotalCreditSummary />

      {/* Header Section */}
      <div className="mt-6 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Purchase Orders
            </h1>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-colors ${
                showFilters 
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'
              }`}
            >
              <Filter className="h-5 w-5" />
            </button>
            {Object.values(filters).some(Boolean) && (
              <span className="text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                Filters active
                <button
                  onClick={clearFilters}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={handleCreatePurchase}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Purchase
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="mb-6">
          <FilterBar 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={clearFilters}
          />
        </div>
      )}

      {/* Purchase Orders List with Loading State */}
      <div className="space-y-6">
        {isFiltering ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Filtering results...</p>
          </div>
        ) : Object.keys(groupedPurchases).length > 0 ? (
          Object.entries(groupedPurchases).map(([dateKey, orders]) => (
            <div key={dateKey}>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {dateKey}
              </h2>
              <div className="grid gap-4">
                {orders.map(order => (
                  <PurchaseCard
                    key={order.id}
                    purchase={order}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              {filters.search 
                ? 'No purchases match your search criteria'
                : 'No purchase orders found'}
            </p>
          </div>
        )}
      </div>

      {/* Purchase Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50">
          <PurchaseForm
            initialData={editingPurchase}
            isEdit={!!editingPurchase}
            onClose={handleCloseForm}
          />
        </div>
      )}

    </div>
  );
};

export default Purchase;
