import { useForm } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const ProductForm = ({ onClose, initialData }) => {
  const { setProducts, setStock } = useAppContext();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      variants: [{ bagSize: '', pricePerQuintal: '', currentStock: 0 }]
    }
  });

  const variants = watch('variants');

  const onSubmit = (data) => {
    const productId = initialData?.id || Date.now().toString();
    const newProduct = { ...data, id: productId };

    // Update products state
    setProducts(prev => 
      initialData 
        ? prev.map(p => p.id === initialData.id ? newProduct : p)
        : [...prev, newProduct]
    );

    // Update stock state with variants
    const stockItems = data.variants.map(variant => ({
      id: `${productId}-${variant.bagSize}`,
      productId,
      productName: data.name,
      bagSize: variant.bagSize,
      quantity: variant.currentStock,
      variantId: `${productId}-${variant.bagSize}`,
      status: 'IN_STOCK'
    }));

    setStock(prev => ({
      ...prev,
      current: initialData
        ? prev.current.filter(item => item.productId !== productId).concat(stockItems)
        : [...prev.current, ...stockItems]
    }));

    onClose();
  };

  const addVariant = () => {
    setValue('variants', [...variants, { bagSize: '', pricePerQuintal: '', currentStock: 0 }]);
  };

  const removeVariant = (index) => {
    setValue('variants', variants.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Product name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Variants
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((_, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="number"
                      {...register(`variants.${index}.bagSize`, { required: true })}
                      placeholder="Bag Size (kg)"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      {...register(`variants.${index}.pricePerQuintal`, { required: true })}
                      placeholder="Price/Quintal"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      {...register(`variants.${index}.currentStock`, { required: true })}
                      placeholder="Current Stock"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-2 text-red-600 hover:text-red-900"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;