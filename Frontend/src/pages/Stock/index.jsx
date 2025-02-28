import React , { useState } from 'react';
import { useRecoilState } from 'recoil';
import { stockState } from '../../store/atoms';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useInventoryEffect } from '../../effects/inventoryEffect';

const Stock = () => {
  useInventoryEffect();
  const [stock, setStock] = useRecoilState(stockState);
  const [activeTab, setActiveTab] = useState('current');

  const handleMoveToInventory = (itemId) => {
    const upcomingItem = stock.upcoming.find(item => item.id === itemId);
    if (!upcomingItem) return;

    setStock(prev => ({
      current: [...prev.current, { ...upcomingItem, status: 'IN_STOCK' }],
      upcoming: prev.upcoming.filter(item => item.id !== itemId)
    }));
  };

  const handleUpdateStock = (itemId, newQuantity, type = 'current') => {
    setStock(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.id === itemId 
          ? { ...item, quantity: parseInt(newQuantity) }
          : item
      )
    }));
  };

  const handleDeleteUpcoming = (itemId) => {
    if (window.confirm('Are you sure you want to delete this upcoming stock?')) {
      setStock(prev => ({
        ...prev,
        upcoming: prev.upcoming.filter(item => item.id !== itemId)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Stock Management</h1>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'current' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600'
            }`}
            onClick={() => setActiveTab('current')}
          >
            Current Stock
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'upcoming' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Stock
          </button>
        </div>
      </div>

      {activeTab === 'current' ? (
        <CurrentStock stock={stock.current} onUpdateStock={handleUpdateStock} />
      ) : (
        <UpcomingStock 
          stock={stock.upcoming} 
          onMoveToInventory={handleMoveToInventory}
          onUpdateStock={(id, qty) => handleUpdateStock(id, qty, 'upcoming')}
          onDelete={handleDeleteUpcoming}
        />
      )}
    </div>
  );
};

const CurrentStock = ({ stock, onUpdateStock }) => (
  <div className="bg-white shadow-sm rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Product
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Variant
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Current Stock
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Min. Stock
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {stock.map((item) => (
          <StockRow 
            key={item.id} 
            item={item} 
            onUpdate={onUpdateStock}
            showMoveButton={false}
          />
        ))}
      </tbody>
    </table>
  </div>
);

const UpcomingStock = ({ stock, onMoveToInventory, onUpdateStock, onDelete }) => (
  <div className="bg-white shadow-sm rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Product
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Variant
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Quantity
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Expected Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {stock.map((item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{item.productName}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{item.bagSize}kg</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => onUpdateStock(item.id, e.target.value)}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{item.expectedDate}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex space-x-2">
                <button
                  onClick={() => onMoveToInventory(item.id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Move to Inventory
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StockRow = ({ item, onUpdate, onMove, showMoveButton }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{item.productName}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-500">{item.bagSize}kg</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => onUpdate(item.id, e.target.value)}
        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </td>
    {!showMoveButton ? (
      <>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{item.minimumStock}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StockStatus item={item} />
        </td>
      </>
    ) : (
      <>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{item.expectedDate}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => onMove(item.id)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Move to Inventory
          </button>
        </td>
      </>
    )}
  </tr>
);

const StockStatus = ({ item }) => {
  const getStatus = () => {
    if (item.quantity <= 0) return { color: 'red', text: 'Out of Stock' };
    return { color: 'green', text: 'In Stock' };
  };

  const status = getStatus();
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
      {status.text}
    </span>
  );
};

export default Stock;
