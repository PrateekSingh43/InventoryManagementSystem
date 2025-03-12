import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from "../context/AppContext";
// Remove the following line:
// import ProductForm from "../components/Products/ProductForm";
// Instead, import the pre-defined product list from the data folder:
import { productsList } from '../data/productsList';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Since these products are pre-defined, we use productsList directly.
  const filteredProducts = productsList.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        {/* Removed add product button */}
      </div>

      <div className="flex items-center px-4 py-2 border rounded-md bg-white">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="ml-2 flex-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.variants.length} variants
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Optionally, edit and delete buttons can be removed or hidden */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Removed ProductForm rendering */}
    </div>
  );
};

export default Products;