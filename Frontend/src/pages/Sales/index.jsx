import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import CreateSaleForm from '../../components/Sales/CreateSaleForm';

const Sales = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { sales = [] } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = (sales || []).filter(sale => 
    sale?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale?.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Sales</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Sale
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center px-4 py-2 border rounded-md bg-white">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-2 flex-1 outline-none"
        />
      </div>

      {/* Sales List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sale.invoiceNumber || `INV-${sale.id}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sale.customerName || 'Walk-in Customer'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  ₹{sale.totalAmount?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full justify-center
                    ${sale.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                      sale.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Sale Modal */}
      {showCreateForm && (
        <CreateSaleForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
};

export default Sales;
