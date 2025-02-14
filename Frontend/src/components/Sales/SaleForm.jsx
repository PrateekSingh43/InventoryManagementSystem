import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formClasses } from '../../utils/formClasses';

const SaleForm = ({ onClose, initialData }) => {
  const { sales, setSales, customers, products, stock, setStock } = useAppContext();

  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: initialData || {
      customerName: '',
      customerId: '',
      date: new Date().toISOString().split('T')[0],
      items: [{ productId: '', variantId: '', quantity: 1, price: 0 }],
      totalAmount: 0,
      paidAmount: 0,
      paymentStatus: 'PENDING'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const onSubmit = (data) => {
    const newSale = {
      ...data,
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date(data.date).toISOString(),
      totalAmount: calculateTotal(data.items),
      paymentStatus: data.paidAmount >= calculateTotal(data.items) ? 'PAID' : 'PENDING'
    };

    setStock(prev => ({
      ...prev,
      current: prev.current.map(item => {
        const saleItem = data.items.find(
          si => si.productId === item.productId && si.bagSize === item.bagSize
        );
        return saleItem
          ? { ...item, quantity: item.quantity - saleItem.quantity }
          : item;
      })
    }));

    setSales([...sales, newSale]);
    onClose();
  };

  const calculateTotal = (items) => 
    items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const handleCustomerChange = (e) => {
    const customer = customers.find(c => c.id === e.target.value);
    setValue('customerName', customer.name);
    setValue('customerId', customer.id);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
      <div className={formClasses.wrapper + " max-w-4xl w-full p-6"}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">New Sale</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={formClasses.label}>Customer</label>
              <select
                onChange={handleCustomerChange}
                className={formClasses.select}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={formClasses.label}>Date</label>
              <input
                type="date"
                {...register('date')}
                className={formClasses.input}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={formClasses.label}>Items</label>
              <button
                type="button"
                onClick={() => append({ productId: '', variantId: '', quantity: 1, price: 0 })}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start mb-4">
                <select
                  {...register(`items.${index}.productId`)}
                  className={formClasses.select}
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  {...register(`items.${index}.quantity`)}
                  placeholder="Quantity"
                  className={formClasses.input}
                />
                <input
                  type="number"
                  {...register(`items.${index}.price`)}
                  placeholder="Price"
                  className={formClasses.input}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:text-red-900"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={formClasses.label}>Paid Amount</label>
              <input
                type="number"
                {...register('paidAmount')}
                className={formClasses.input}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={formClasses.button.secondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={formClasses.button.primary}
            >
              Create Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
