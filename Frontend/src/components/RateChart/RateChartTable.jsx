import React, { useState } from 'react';
import { Edit2, Save, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RateChartTable = ({ products, selectedDate, isHistoricalView, onUpdateRates }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedRates, setEditedRates] = useState({});

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedRates({
      id: product.id,
      minPrice: product.minPrice || '',
      maxPrice: product.maxPrice || ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedRates({});
  };

  const handleChange = (field, value) => {
    setEditedRates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (product) => {
    try {
      if (!editedRates.minPrice || !editedRates.maxPrice) {
        toast.error('Please fill in both minimum and maximum rates');
        return;
      }

      const updatedProduct = {
        ...product,
        minPrice: editedRates.minPrice,
        maxPrice: editedRates.maxPrice
      };

      // Update the rates in parent component
      await onUpdateRates(updatedProduct);
      toast.success('Rates updated successfully');
      setEditingId(null);
      setEditedRates({});
    } catch (error) {
      toast.error('Failed to update rates');
 se    }
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this rate?')) {
      try {
        onUpdateRates(null, productId); // Pass null as update and productId for deletion
        toast.success('Rate deleted successfully');
      } catch (error) {
        toast.error('Failed to delete rate');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Product Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Weight (kg)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Min Rate (₹/qtl)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Max Rate (₹/qtl)
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {product.name}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.weight}
                </span>
              </td>
              <td className="px-6 py-4">
                {editingId === product.id ? (
                  <input
                    type="number"
                    value={editedRates.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    className="w-24 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-indigo-500"
                    placeholder="Min rate"
                  />
                ) : (
                  <span className="text-sm text-gray-900 dark:text-white">
                    {product.minPrice || '-'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === product.id ? (
                  <input
                    type="number"
                    value={editedRates.maxPrice}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    className="w-24 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-indigo-500"
                    placeholder="Max rate"
                  />
                ) : (
                  <span className="text-sm text-gray-900 dark:text-white">
                    {product.maxPrice || '-'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end space-x-3">
                  {editingId === product.id ? (
                    <>
                      <button
                        onClick={() => handleSave(product)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                        disabled={isHistoricalView}
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isHistoricalView}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RateChartTable;
