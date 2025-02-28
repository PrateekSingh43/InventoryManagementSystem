import React, { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SupplierList from '../../components/Supplier/SupplierList';
import SupplierForm from '../../components/Supplier/SupplierForm';
import SupplierLedger from '../../components/Supplier/SupplierLedger';

const Suppliers = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const { suppliers } = useAppContext();

  if (selectedSupplier) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedSupplier(null)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Suppliers
          </button>
        </div>
        <SupplierLedger supplier={selectedSupplier} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Supplier
        </button>
      </div>

      <SupplierList
        suppliers={suppliers}
        onSelect={setSelectedSupplier}
      />

      {showForm && (
        <SupplierForm
          onClose={() => setShowForm(false)}
          initialData={null}
        />
      )}
    </div>
  );
};

export default Suppliers;
