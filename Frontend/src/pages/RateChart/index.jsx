import React, { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const RateChart = () => {
  const { products, setProducts } = useAppContext();
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  const handleEdit = (product) => {
    setEditId(product.id);
    setEditPrice(product.currentPrice);
  };

  const handleSave = (id) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, currentPrice: parseFloat(editPrice) || product.currentPrice }
          : product
      )
    );
    setEditId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Rate Chart</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight (kg)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price (₹/quintal)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.weight}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editId === product.id ? (
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-24 border rounded-md p-1"
                  />
                ) : (
                  `₹${product.currentPrice}`
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {editId === product.id ? (
                  <>
                    <button onClick={() => handleSave(product.id)} className="text-green-600 mr-2">
                      <Save className="h-5 w-5" />
                    </button>
                    <button onClick={() => setEditId(null)} className="text-red-600">
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(product)} className="text-blue-600">
                    <Pencil className="h-5 w-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RateChart;
