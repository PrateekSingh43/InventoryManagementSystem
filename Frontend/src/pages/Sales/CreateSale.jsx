import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { generateInvoiceNumber } from '../../utils/helpers';

const CreateSale = ({ onClose }) => {
  const { customers, products, addSale } = useAppContext();
  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      customerType: 'regular',
      customerId: '',
      oneTimeCustomerName: '',
      oneTimeCustomerPhone: '',
      items: [{ productId: '', quantity: 1, rate: 0 }],
      discount: 0,
      paymentMethod: 'CASH',
      amountPaid: 0
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const customerType = watch('customerType');
  const items = watch('items');
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const discount = watch('discount') || 0;
  const total = subtotal - discount;

  const onSubmit = (data) => {
    const saleData = {
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber(),
      date: data.date,
      customerId: data.customerType === 'regular' ? data.customerId : null,
      customerName: data.customerType === 'regular' 
        ? customers.find(c => c.id === data.customerId)?.name 
        : data.oneTimeCustomerName,
      items: data.items,
      subtotal,
      discount,
      total,
      amountPaid: parseFloat(data.amountPaid),
      paymentMethod: data.paymentMethod,
      status: data.amountPaid >= total ? 'PAID' : data.amountPaid > 0 ? 'PARTIAL' : 'UNPAID'
    };

    addSale(saleData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Sale</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form content... */}
            {/* Customer selection, items, payment details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Type</label>
                <select
                  {...register('customerType')}
                  className="mt-1 block w-full rounded-md border-gray-300"
                >
                  <option value="regular">Regular Customer</option>
                  <option value="onetime">One-time Customer</option>
                </select>
              </div>

              {customerType === 'regular' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Customer</label>
                  <select
                    {...register('customerId')}
                    className="mt-1 block w-full rounded-md border-gray-300"
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input
                      type="text"
                      {...register('oneTimeCustomerName')}
                      className="mt-1 block w-full rounded-md border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      {...register('oneTimeCustomerPhone')}
                      className="mt-1 block w-full rounded-md border-gray-300"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Items</label>
                <button
                  type="button"
                  onClick={() => append({ productId: '', quantity: 1, rate: 0 })}
                  className="inline-flex items-center text-sm text-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5">
                    <select
                      {...register(`items.${index}.productId`)}
                      className="block w-full rounded-md border-gray-300"
                    >
                      <option value="">Select product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`)}
                      min="1"
                      className="block w-full rounded-md border-gray-300"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      {...register(`items.${index}.rate`)}
                      className="block w-full rounded-md border-gray-300"
                      placeholder="Rate"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Details */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    {...register('paymentMethod')}
                    className="mt-1 block w-full rounded-md border-gray-300"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                  <input
                    type="number"
                    {...register('amountPaid')}
                    className="mt-1 block w-full rounded-md border-gray-300"
                    max={total}
                  />
                </div>
              </div>

              <div className="mt-4 text-right">
                <p className="text-sm text-gray-600">Subtotal: ₹{subtotal.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Discount: ₹{discount.toLocaleString()}</p>
                <p className="text-lg font-bold">Total: ₹{total.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Create Sale
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSale;
