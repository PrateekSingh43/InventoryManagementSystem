import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import PurchaseForm from '../../components/Purchase/PurchaseForm';

const Purchase = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { purchases } = useAppContext();

  const filteredPurchases = purchases.filter(purchase =>
    purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Purchase
        </button>
      </div>

      <div className="flex items-center px-4 py-2 border rounded-md bg-white">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search purchases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-2 flex-1 outline-none"
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredPurchases.map((purchase) => (
            <li key={purchase.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {purchase.supplierName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Invoice #{purchase.invoiceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ₹{purchase.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(purchase.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && <PurchaseForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Purchase;
