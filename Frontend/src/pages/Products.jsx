import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ProductForm from '../components/Products/ProductForm';

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { products, setProducts } = useAppContext();
  const navigate = useNavigate();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
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
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && <ProductForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Products;