import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const PurchaseForm = ({ onClose, initialData }) => {
  const { setPurchases, setStock, products } = useAppContext();

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: initialData || {
      supplierName: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      items: [{
        productId: '',
        variantId: '',
        bagSize: '',
        pricePerQuintal: '',
        quantity: 1,
        expectedDeliveryDate: ''
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const selectedProducts = watch('items');

  const getProductVariants = (productId) => {
    const product = products.find(p => p.id === productId);
    return product?.variants || [];
  };

  const onSubmit = (data) => {
    const purchase = {
      ...data,
      id: initialData?.id || Date.now().toString(),
      status: 'PENDING'
    };

    // Update purchases state
    setPurchases(prev => 
      initialData 
        ? prev.map(p => p.id === initialData.id ? purchase : p)
        : [...prev, purchase]
    );

    // Update upcoming stock for new purchases
    if (!initialData) {
      const upcomingStock = data.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          id: Date.now().toString(),
          productId: item.productId,
          productName: product?.name,
          variantId: item.variantId,
          bagSize: item.bagSize,
          quantity: item.quantity,
          expectedDeliveryDate: item.expectedDeliveryDate
        };
      });

      setStock(prev => ({
        ...prev,
        upcoming: [...prev.upcoming, ...upcomingStock]
      }));
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Purchase Order' : 'New Purchase Order'}
          </h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Supplier Name
              </label>
              <input
                type="text"
                {...register('supplierName', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Number
              </label>
              <input
                type="text"
                {...register('invoiceNumber', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purchase Date
              </label>
              <input
                type="date"
                {...register('date')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Items</label>
              <button
                type="button"
                onClick={() => append({
                  productId: '',
                  variantId: '',
                  bagSize: '',
                  pricePerQuintal: '',
                  quantity: 1,
                  expectedDeliveryDate: ''
                })}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-6 gap-4 mb-4">
                <select
                  {...register(`items.${index}.productId`)}
                  className="col-span-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>

                <select
                  {...register(`items.${index}.bagSize`)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Bag Size</option>
                  {getProductVariants(selectedProducts[index]?.productId).map(variant => (
                    <option key={variant.bagSize} value={variant.bagSize}>
                      {variant.bagSize}kg
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  {...register(`items.${index}.pricePerQuintal`)}
                  placeholder="Price/Quintal"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />

                <input
                  type="number"
                  {...register(`items.${index}.quantity`)}
                  placeholder="Quantity"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />

                <input
                  type="date"
                  {...register(`items.${index}.expectedDeliveryDate`)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

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
              {initialData ? 'Update' : 'Create'} Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;
