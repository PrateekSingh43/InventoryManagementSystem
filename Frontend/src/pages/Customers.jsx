import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CustomerForm from '../components/Customers/CustomerForm';

const Customers = () => {
  const { customers, setCustomers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      <div className="flex items-center px-4 py-2 border rounded-md bg-white">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-2 flex-1 outline-none"
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredCustomers.map((customer) => (
            <li key={customer.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    {customer.type === 'regular' ? (
                      <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <UserX className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <h3 className="text-lg font-medium text-gray-900">
                      {customer.name}
                    </h3>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 space-y-1">
                    {customer.phone && <p>📞 {customer.phone}</p>}
                    {customer.email && <p>✉️ {customer.email}</p>}
                    {customer.type === 'regular' && (
                      <p className="text-indigo-600">
                        Credit Limit: ₹{customer.creditLimit?.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
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

      {showForm && (
        <CustomerForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default Customers;