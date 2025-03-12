import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Save, Trash2, History, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { format } from 'date-fns';
import DatePicker from '../../components/common/DatePicker';
import { toast } from 'react-hot-toast';

const RateChart = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingId, setEditingId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const { products, rateHistory, updateRates, logActivity } = useAppContext();

  // Get available dates from rate history
  const availableDates = useMemo(() => {
    return Object.keys(rateHistory)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(date => ({
        date,
        formattedDate: format(new Date(date), 'dd-MM-yyyy')
      }));
  }, [rateHistory]);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product }); // Store the product being edited
  };

  const handleInputChange = (field, value) => {
    if (!editedProduct) return;
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (productId) => {
    try {
      if (!editedProduct) return;

      // Create updated products array with the edited product
      const updatedProducts = productsWithRates.map(p => 
        p.id === productId ? {
          ...p,
          ...editedProduct,
          // Ensure these are stored as numbers
          minPrice: parseFloat(editedProduct.minPrice) || 0,
          maxPrice: parseFloat(editedProduct.maxPrice) || 0,
          weight: parseFloat(editedProduct.weight) || 0
        } : p
      );

      // Save to rate history
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      await updateRates(dateKey, updatedProducts);
      
      // Reset editing state
      setEditingId(null);
      setEditedProduct(null);
      
      // Show success message
      toast.success('Rate updated successfully');
    } catch (error) {
      toast.error('Failed to update rate');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct(null);
  };

  // Get rates for selected date with proper formatting
  const getRatesForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const rates = rateHistory[dateKey] || [];
    return rates.map(rate => ({
      ...rate,
      minPrice: rate.minPrice?.toString() || '',
      maxPrice: rate.maxPrice?.toString() || ''
    }));
  };

  // Updated productsWithRates memo
  const productsWithRates = useMemo(() => {
    const historicalRates = getRatesForDate(selectedDate);
    
    return products.map(product => {
      const historicalRate = historicalRates.find(rate => 
        rate.id === product.id || (rate.name === product.name && rate.weight === product.weight)
      );
      
      return {
        ...product,
        minPrice: historicalRate?.minPrice || '',
        maxPrice: historicalRate?.maxPrice || '',
        weight: historicalRate?.weight || product.weight
      };
    });
  }, [products, selectedDate, rateHistory]);

  const handleUpdateRates = async (updatedProducts) => {
    try {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      await updateRates(dateKey, updatedProducts);
      logActivity(
        'RATE_UPDATE',
        'Rate Chart Updated',
        `Updated rates for ${format(selectedDate, 'dd-MM-yyyy')}`
      );
    } catch (error) {
      console.error('Failed to update rates:', error);
      throw error;
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this rate?')) {
      try {
        const updatedRates = productsWithRates.filter(p => p.id !== productId);
        await handleUpdateRates(updatedRates);
        toast.success('Rate deleted successfully');
      } catch (error) {
        toast.error('Failed to delete rate');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Rate Chart</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            title="View History"
          >
            <History className="h-5 w-5" />
          </button>

          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Select date"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rate History</h3>
            <div className="grid grid-cols-4 gap-4">
              {availableDates.map(({ date, formattedDate }) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(new Date(date));
                    setShowHistory(false);
                  }}
                  className="p-2 text-sm rounded-md text-gray-700 dark:text-gray-300 
                           hover:bg-gray-100 dark:hover:bg-gray-700 text-left
                           transition-colors duration-150"
                >
                  {formattedDate}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rate Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Weight (kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Min Rate (₹)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Max Rate (₹)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {productsWithRates.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                    <input
                      type="text"
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                      value={editedProduct?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                      value={editedProduct?.weight || ''}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {product.weight}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                      value={editedProduct?.minPrice || ''}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {product.minPrice || '-'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                      value={editedProduct?.maxPrice || ''}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {product.maxPrice || '-'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-3">
                    {editingId === product.id ? (
                      <>
                        <button
                          onClick={() => handleSave(product.id)}
                          className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
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
    </div>
  );
};

export default RateChart;
