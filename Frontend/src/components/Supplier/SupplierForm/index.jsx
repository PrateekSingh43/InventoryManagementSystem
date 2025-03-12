import React from 'react';
import { useForm } from 'react-hook-form';
import { X, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../../context/AppContext';

const SupplierForm = ({ onClose, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      address: '',
      contact: '',
      openingBalance: 0,
      gstNumber: '',
      notes: ''
    }
  });

  const { setSuppliers } = useAppContext();

  const onSubmit = (data) => {
    try {
      const newSupplier = {
        id: initialData?.id || Date.now().toString(),
        name: data.name.trim(),
        address: data.address.trim(),
        contact: data.contact.trim(),
        openingBalance: parseFloat(data.openingBalance) || 0,
        gstNumber: data.gstNumber.trim(),
        notes: data.notes.trim(),
        transactions: initialData?.transactions || [],
        createdAt: initialData?.createdAt || new Date().toISOString()
      };

      setSuppliers(prev => {
        if (initialData) {
          return prev.map(s => s.id === initialData.id ? newSupplier : s);
        }
        return [...prev, newSupplier];
      });

      toast.success(initialData ? 'Supplier updated' : 'Supplier added');
      onClose();
    } catch (error) {
      toast.error('Failed to save supplier');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Edit Supplier' : 'Add Supplier'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full rounded-md border-gray-300"
              placeholder="Supplier name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              {...register('address')}
              rows={3}
              className="w-full rounded-md border-gray-300"
              placeholder="Full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              {...register('contact')}
              className="w-full rounded-md border-gray-300"
              placeholder="Phone number"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium mb-1">Opening Balance</label>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  toast.info(
                    "Opening Balance: Initial amount from previous transactions.\n" +
                    "Positive: Amount you owe to supplier\n" +
                    "Zero: Fresh start, no pending amounts\n" +
                    "Negative: Amount supplier owes you", 
                    { duration: 6000 }
                  );
                }}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                {...register('balanceType')}
                className="w-32 rounded-md border-gray-300 dark:border-gray-600"
              >
                <option value="payable">Payable to</option>
                <option value="receivable">Receivable from</option>
              </select>
              <input
                type="number"
                {...register('openingBalance')}
                className="flex-1 rounded-md border-gray-300 dark:border-gray-600"
                placeholder="Enter amount (0 if none)"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Leave as 0 if starting fresh with this supplier
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GST Number</label>
            <input
              {...register('gstNumber')}
              className="w-full rounded-md border-gray-300"
              placeholder="GST number (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              {...register('notes')}
              rows={2}
              className="w-full rounded-md border-gray-300"
              placeholder="Additional notes"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              {initialData ? 'Update' : 'Add'} Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;
