import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Minus, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const CreateSaleForm = ({ onClose }) => {
  const { products, addSale } = useAppContext();
  
  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      customerPhone: '',
      items: [{ productId: '', quantity: 1, rate: 0 }],
      paymentMethod: 'CASH',
      amountPaid: 0
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const items = watch('items');

  // Auto-set rate when product is selected
  useEffect(() => {
    items.forEach((item, index) => {
      if (item.productId) {
        const product = products.find(p => p.id === item.productId);
        if (product && !item.rate) {
          setValue(`items.${index}.rate`, product.currentPrice);
        }
      }
    });
  }, [items, products, setValue]);

  const total = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return sum;
    const quantity = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    // Convert to quintals (100 kg = 1 quintal)
    const quintals = (quantity * product.weight) / 100;
    return sum + (quintals * rate);
  }, 0);

  const onSubmit = (data) => {
    try {
      if (!data.customerName.trim()) {
        toast.error('Customer name is required');
        return;
      }

      if (!data.items.some(item => item.productId && item.quantity > 0)) {
        toast.error('Please add at least one item');
        return;
      }

      const saleData = {
        id: Date.now().toString(),
        date: data.date,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        items: data.items.filter(item => item.productId && item.quantity > 0)
          .map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              productName: product?.name,
              weight: product?.weight,
              quantity: parseFloat(item.quantity),
              rate: parseFloat(item.rate),
              total: (parseFloat(item.quantity) * product?.weight * parseFloat(item.rate)) / 100
            };
          }),
        totalAmount: total,
        amountPaid: parseFloat(data.amountPaid) || 0,
        paymentMethod: data.paymentMethod,
        status: data.amountPaid >= total ? 'PAID' : 
                data.amountPaid > 0 ? 'PARTIAL' : 'UNPAID',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`
      };

      addSale(saleData);
      toast.success('Sale created successfully');
      onClose();
    } catch (error) {
      console.error('Sale creation error:', error);
      toast.error('Failed to create sale');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Sale</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Customer Name</label>
              <input
                type="text"
                {...register('customerName')}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div>
              <label>Phone Number</label>
              <input
                type="text"
                {...register('customerPhone')}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label>Items</label>
              <button
                type="button"
                onClick={() => append({ productId: '', quantity: 1, rate: 0 })}
                className="text-indigo-600"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <select
                      {...register(`items.${index}.productId`)}
                      className="block w-full rounded-md border-gray-300"
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.weight}kg)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`)}
                      placeholder="Qty"
                      className="block w-full rounded-md border-gray-300"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      {...register(`items.${index}.rate`)}
                      placeholder="Rate"
                      className="block w-full rounded-md border-gray-300"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Payment Method</label>
                <select
                  {...register('paymentMethod')}
                  className="mt-1 block w-full rounded-md border-gray-300"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label>Amount Paid</label>
                <input
                  type="number"
                  {...register('amountPaid')}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  max={total}
                />
              </div>
            </div>
            <div className="mt-4 text-right">
              <p className="text-xl font-bold">Total: ₹{total.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md"
            >
              Create Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSaleForm;
