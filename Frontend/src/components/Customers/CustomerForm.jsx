import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const CustomerForm = ({ onClose, initialData }) => {
  const { customers, setCustomers } = useAppContext();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: initialData || {
      name: '',
      type: 'one-time',
      phone: '',
      email: '',
      address: '',
      creditLimit: 0
    }
  });

  const customerType = watch('type');

  const onSubmit = (data) => {
    if (initialData) {
      setCustomers(customers.map(c => c.id === initialData.id ? { ...data, id: initialData.id } : c));
    } else {
      setCustomers([...customers, { ...data, id: Date.now().toString(), currentCredit: 0 }]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Customer name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Type
            </label>
            <select
              {...register('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="one-time">One-time Customer</option>
              <option value="regular">Regular Customer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {customerType === 'regular' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Credit Limit (₹)
              </label>
              <input
                type="number"
                {...register('creditLimit')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
CustomerForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    creditLimit: PropTypes.number,
  }),
};


export default CustomerForm;