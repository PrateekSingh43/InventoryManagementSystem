import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import PurchaseForm from '../../components/Purchase/PurchaseForm';
import PurchaseList from '../../components/Purchase/PurchaseList';
import TotalCreditSummary from '../../components/Purchase/TotalCreditSummary';

const Purchase = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const { purchase } = useAppContext();

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedPurchase(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
          <TotalCreditSummary />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Purchase
        </button>
      </div>

      <PurchaseList 
        purchases={purchase}
        onEdit={handleEdit}
      />

      {showForm && (
        <PurchaseForm
          onClose={handleClose}
          initialData={selectedPurchase}
          isEdit={!!selectedPurchase}
        />
      )}
    </div>
  );
};

export default Purchase;
