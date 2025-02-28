import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { formatDateForInput, parseDateString } from '../../utils/dateFormatter';

const RateChart = () => {
  const { rateHistory, updateRateHistory, products } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(null);
  const [currentRates, setCurrentRates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize rates for current date
  useEffect(() => {
    try {
      setIsLoading(true);
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const existingRates = rateHistory[dateKey] || [];
      
      if (existingRates.length === 0 && products.length > 0) {
        // Create initial rates from products
        const initialRates = products.map(product => ({
          id: product.id,
          name: product.name,
          weight: product.variants?.[0]?.bagSize || '',
          minRate: '',
          maxRate: ''
        }));
        setCurrentRates(initialRates);
      } else {
        setCurrentRates(existingRates);
      }
    } catch (error) {
      toast.error('Error loading rates');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, rateHistory, products]);

  // Handle empty states and loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No products available. Please add products first.
        </p>
      </div>
    );
  }

  const handleUpdate = (id, field, value) => {
    setCurrentRates(prev => 
      prev.map(rate => 
        rate.id === id ? { ...rate, [field]: value } : rate
      )
    );
  };

  const handleSave = async (id) => {
    try {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      await updateRateHistory(dateKey, currentRates);
      setIsEditing(null);
      toast.success('Rate updated successfully');
    } catch (error) {
      toast.error('Failed to update rate');
    }
  };

  const handleAddProduct = () => {
    const newRate = {
      id: Date.now().toString(),
      name: '',
      weight: '',
      minRate: '',
      maxRate: ''
    };
    setCurrentRates(prev => [...prev, newRate]);
    setIsEditing(newRate.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const updatedProducts = currentRates.filter(p => p.id !== id);
      await updateRateHistory(dateKey, updatedProducts);
      setCurrentRates(updatedProducts);
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        {/* Date selector and Add Product button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Rate Chart</h2>
            <input
              type="text"
              value={formatDateForInput(selectedDate)}
              onChange={(e) => {
                const dateStr = e.target.value;
                if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                  const parsedDate = parseDateString(dateStr);
                  setSelectedDate(new Date(parsedDate));
                }
              }}
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              placeholder="DD/MM/YYYY"
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={() => {
              const newRate = {
                id: Date.now().toString(),
                name: '',
                weight: '',
                minRate: '',
                maxRate: ''
              };
              setCurrentRates(prev => [...prev, newRate]);
              setIsEditing(newRate.id);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Product
          </button>
        </div>
      </div>

      {/* Rate table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weight (kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Min Rate (₹)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max Rate (₹)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentRates.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing === product.id ? (
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleUpdate(product.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing === product.id ? (
                    <input
                      type="number"
                      value={product.weight}
                      onChange={(e) => handleUpdate(product.id, 'weight', e.target.value)}
                      className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <span className="text-gray-900 dark:text-gray-100">{product.weight}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={product.minRate}
                    onChange={(e) => handleUpdate(product.id, 'minRate', e.target.value)}
                    className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                    disabled={isEditing !== product.id}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={product.maxRate}
                    onChange={(e) => handleUpdate(product.id, 'maxRate', e.target.value)}
                    className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                    disabled={isEditing !== product.id}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditing === product.id ? (
                    <button
                      onClick={() => handleSave(product.id)}
                      className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(product.id)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RateChart;
