import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formClasses } from '../common/FormStyles';
import { modalStyles } from '../common/ModalStyles';
import { toast } from 'react-hot-toast';
import { getCurrentCounter } from '../../utils/invoiceGenerator';
import { productsList } from '../../data/products';
import { 
  formatDate,
  formatDisplayDate,
  convertToInputDate,
  convertFromInputDate,
  getCurrentDate
} from '../../utils/dateUtils';

const PurchaseForm = ({ onClose, initialData, isEdit }) => {
  const { setPurchase, addPurchase } = useAppContext();

  // Update form initialization with proper date handling
  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: isEdit ? {
      supplierName: initialData?.supplier || '',
      supplierAddress: initialData?.supplierAddress || '',
      invoiceNumber: initialData?.orderNumber || '',
      date: convertToInputDate(initialData?.date || getCurrentDate()),
      items: initialData?.items || [{
        productId: '',
        productName: '',
        bagSize: '',
        pricePerQuintal: '',
        quantity: ''
      }],
      paymentDate: convertToInputDate(getCurrentDate()),
      newPaymentAmount: '',
      paymentMethod: 'CASH',
      transactionId: ''
    } : {
      supplierName: '',
      supplierAddress: '',
      invoiceNumber: getCurrentCounter(), // Now visible on form load
      date: convertToInputDate(getCurrentDate()),
      items: [{
        productId: '',
        productName: '',
        bagSize: '',
        pricePerQuintal: '',
        quantity: ''
      }],
      initialPayment: '',
      paymentMethod: 'CASH',
      transactionId: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Modify the calculateTotals function for more granular updates
  const calculateTotals = (items) => {
    if (!items?.length) return { weight: 0, amount: 0 };
    
    return items.reduce((acc, item) => {
      if (!item) return acc;
      
      const bagSize = parseFloat(item.bagSize) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const pricePerQuintal = parseFloat(item.pricePerQuintal) || 0;
      
      // Only calculate if we have all required values
      if (bagSize && quantity && pricePerQuintal) {
        const weight = bagSize * quantity;
        const amount = (weight / 100) * pricePerQuintal; // Convert to quintals
        
        return {
          weight: acc.weight + weight,
          amount: acc.amount + amount
        };
      }
      return acc;
    }, { weight: 0, amount: 0 });
  };

  // Watch all item fields for changes
  const watchedItems = watch('items');
  const runningTotals = React.useMemo(() => {
    return calculateTotals(watchedItems);
  }, [watchedItems]);

  // Function to handle product selection
  const handleProductSelection = (index, productName) => {
    const selectedProduct = products.find(p => p.name === productName);
    if (selectedProduct) {
      setValue(`items.${index}.productName`, selectedProduct.name);
      setValue(`items.${index}.bagSize`, ''); // Reset bag size when product changes
      setValue(`items.${index}.bagSizes`, selectedProduct.bagSizes); // Store available bag sizes
    }
  };

  // Optimize product selection handling
  const handleProductSelect = (index, productName) => {
    const product = products.find(p => p.name === productName);
    if (product) {
      setValue(`items.${index}.productName`, product.name);
      setValue(`items.${index}.bagSize`, product.bagSize);
      // Focus quantity field after selection
      setTimeout(() => {
        document.querySelector(`input[name="items.${index}.quantity"]`)?.focus();
      }, 100);
    }
  };

  // Modified onSubmit to include initial payment in payment history
  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        date: convertFromInputDate(data.date), // Convert to dd-MM-yyyy
        // ... other fields ...
      };

      if (isEdit) {
        // Handle payment update
        const newPaymentAmount = parseFloat(data.newPaymentAmount) || 0;
        const remainingAmount = initialData.totalAmount - 
          (initialData.paymentHistory || []).reduce((sum, p) => sum + p.amount, 0);

        if (newPaymentAmount > remainingAmount) {
          toast.error(`Maximum payment allowed is ₹${remainingAmount.toLocaleString()}`);
          return;
        }

        if (newPaymentAmount > 0) {
          const newPayment = {
            amount: newPaymentAmount,
            type: data.paymentMethod,
            transactionRef: data.paymentMethod !== 'CASH' ? data.transactionId : null,
            date: convertFromInputDate(data.paymentDate), // Store in dd-MM-yyyy
          };

          const updatedPayments = [...(initialData.paymentHistory || []), newPayment];
          const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);

          setPurchase(prev => prev.map(p => 
            p.id === initialData.id 
              ? {
                  ...initialData,
                  paymentHistory: updatedPayments,
                  remainingAmount: initialData.totalAmount - totalPaid,
                  status: totalPaid === initialData.totalAmount ? 'paid' : 
                          totalPaid === 0 ? 'unpaid' : 'partial'
                }
              : p
          ));

          toast.success('Payment updated successfully');
        }
      } else {
        const initialPayment = parseFloat(data.initialPayment) || 0;
        const purchaseData = {
          supplier: data.supplierName,
          supplierAddress: data.supplierAddress,
          date: convertFromInputDate(data.date), // Store in dd-MM-yyyy
          orderNumber: data.invoiceNumber,
          items: data.items.map(item => ({
            productName: item.productName,
            bagSize: parseFloat(item.bagSize),
            pricePerQuintal: parseFloat(item.pricePerQuintal),
            quantity: parseFloat(item.quantity)
          })),
          totalAmount: runningTotals.amount,
          initialPayment,
          paymentHistory: initialPayment > 0 ? [{
            amount: initialPayment,
            type: data.paymentMethod,
            transactionRef: data.paymentMethod !== 'CASH' ? data.transactionId : null,
            date: convertFromInputDate(data.date), // Store in dd-MM-yyyy
          }] : [],
          remainingAmount: runningTotals.amount - initialPayment,
          status: initialPayment >= runningTotals.amount ? 'paid' : 
                 initialPayment > 0 ? 'partial' : 'unpaid',
          paymentMethod: data.paymentMethod
        };

        addPurchase(purchaseData);
        onClose();
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast.error('Failed to process purchase');
    }
  };

  // Add a function to calculate remaining amount
  const calculateRemainingAmount = () => {
    if (!initialData) return 0;
    const totalPaid = (initialData.paymentHistory || [])
      .reduce((sum, p) => sum + p.amount, 0);
    return initialData.totalAmount - totalPaid;
  };

  // Add function to calculate single item total
  const calculateItemTotal = (item) => {
    const bagSize = parseFloat(item.bagSize) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const pricePerQuintal = parseFloat(item.pricePerQuintal) || 0;
    
    const weight = bagSize * quantity;
    const amount = (weight / 100) * pricePerQuintal;

    return {
      weight,
      amount
    };
  };

  // Update the item fields rendering
  const renderItemFields = (index) => (
    <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-12 gap-4">
        {/* Product Selection */}
        <div className="col-span-4">
          <label className={`${formClasses.label} required`}>Product Name</label>
          <select
            {...register(`items.${index}.productName`, { required: true })}
            className={`${formClasses.select} h-11`}
            onChange={(e) => {
              const product = productsList.find(p => p.name === e.target.value);
              if (product && product.bagSizes.length === 1) {
                // If product has only one bag size, auto-select it
                setValue(`items.${index}.bagSize`, product.bagSizes[0]);
                // Focus quantity field
                setTimeout(() => {
                  document.querySelector(`input[name="items.${index}.quantity"]`)?.focus();
                }, 100);
              } else {
                // Reset bag size if product has multiple size options
                setValue(`items.${index}.bagSize`, '');
              }
            }}
          >
            <option value="">Select Product</option>
            {productsList.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bag Size Selection */}
        <div className="col-span-2">
          <label className={`${formClasses.label} required`}>Bag Size</label>
          <select
            {...register(`items.${index}.bagSize`, { required: true })}
            className={`${formClasses.select} h-11`}
          >
            <option value="">Select Size</option>
            {watch(`items.${index}.productName`) && 
              productsList
                .find(p => p.name === watch(`items.${index}.productName`))
                ?.bagSizes.map(size => (
                  <option key={size} value={size}>{size} kg</option>
                ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div className="col-span-2">
          <label className={`${formClasses.label} required`}>Quantity</label>
          <input
            type="number"
            {...register(`items.${index}.quantity`, { required: true })}
            className={`${formClasses.input} h-11`}
            placeholder="No. of bags"
          />
        </div>

        {/* Price Input */}
        <div className="col-span-3">
          <label className={`${formClasses.label} required`}>Rate/Quintal</label>
          <input
            type="number"
            {...register(`items.${index}.pricePerQuintal`, { required: true })}
            className={`${formClasses.input} h-11`}
            placeholder="₹"
          />
        </div>

        {/* Remove Button */}
        <div className="col-span-1 flex items-end justify-center">
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md"
            >
              <Minus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Item Total */}
      {watch(`items.${index}.bagSize`) && watch(`items.${index}.quantity`) && (
        <div className="mt-3 p-2 bg-white dark:bg-gray-700/50 rounded-md flex justify-end space-x-6">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Weight: {calculateItemTotal(watch(`items.${index}`)).weight.toFixed(2)} kg
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Amount: ₹{calculateItemTotal(watch(`items.${index}`)).amount.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-0 mx-auto p-5 w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Update Payment' : 'New Purchase'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {isEdit ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Number</label>
                  <p className="text-lg font-medium text-gray-900">#{initialData.orderNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Purchase Date</label>
                  <p className="text-lg font-medium text-gray-900">{formatDate(initialData.date)}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Items Purchased</h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  {initialData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">{item.bagSize}kg × {item.quantity} bags</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.pricePerQuintal}/qtl</p>
                        <p className="text-sm text-gray-500">
                          Weight: {(item.bagSize * item.quantity).toFixed(2)} kg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-right">
                  <p className="text-sm text-gray-500">
                    Total Amount: ₹{initialData.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Remaining: ₹{calculateRemainingAmount().toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payment Update Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Update Payment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={formClasses.label}>Payment Amount *</label>
                    <input
                      type="number"
                      {...register('newPaymentAmount', { required: true })}
                      max={calculateRemainingAmount()}
                      className={formClasses.input}
                      placeholder={`Max: ₹${calculateRemainingAmount().toLocaleString()}`}
                    />
                  </div>
                  <div>
                    <label className={formClasses.label}>Payment Method *</label>
                    <select {...register('paymentMethod')} className={formClasses.select}>
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                {watch('paymentMethod') !== 'CASH' && (
                  <div className="mt-4">
                    <label className={formClasses.label}>Transaction ID</label>
                    <input
                      type="text"
                      {...register('transactionId')}
                      className={formClasses.input}
                      placeholder="Enter transaction reference"
                    />
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={onClose} className={formClasses.cancelButton}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={formClasses.submitButton}
                  disabled={calculateRemainingAmount() <= 0}
                >
                  Update Payment
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={formClasses.label}>Supplier Name *</label>
                  <input
                    type="text"
                    {...register('supplierName', { required: true })}
                    className={formClasses.input}
                  />
                </div>
                
                <div className="col-span-2">
                  <label className={formClasses.label}>Supplier Address</label>
                  <textarea
                    {...register('supplierAddress')}
                    className={formClasses.input}
                    rows={3}
                  />
                </div>

                <div>
                  <label className={formClasses.label}>Invoice Number</label>
                  <input
                    type="text"
                    {...register('invoiceNumber')}
                    className={`${formClasses.input} bg-gray-50`}
                    readOnly
                  />
                </div>

                <div>
                  <label className={formClasses.label}>Purchase Date *</label>
                  <input
                    type="date"
                    {...register('date')}
                    className={formClasses.input}
                    defaultValue={convertToInputDate(getCurrentDate())}
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className={formClasses.label}>Items *</label>
                  <button
                    type="button"
                    onClick={() => append({
                      productName: '',
                      bagSize: '',
                      pricePerQuintal: '',
                      quantity: ''
                    })}
                    className="inline-flex items-center text-sm text-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>

                {fields.map((field, index) => renderItemFields(index))}
              </div>

              {/* Running Totals */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Weight</p>
                    <p className="text-lg font-bold">{runningTotals.weight.toFixed(2)} kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-lg font-bold">₹{runningTotals.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={formClasses.label}>Initial Payment</label>
                    <input
                      type="number"
                      {...register('initialPayment')}
                      className={formClasses.input}
                    />
                  </div>
                  <div>
                    <label className={formClasses.label}>Payment Method</label>
                    <select
                      {...register('paymentMethod')}
                      className={formClasses.select}
                    >
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className={formClasses.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={formClasses.submitButton}
                >
                  Create Purchase
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;
