import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formClasses } from '../common/FormStyles';
import { modalStyles } from '../common/ModalStyles';
import { toast } from 'react-hot-toast';
import { getCurrentCounter } from '../../utils/invoiceGenerator';
import { productsList, bagSizes } from '../../data/products';
import { 
  formatDate, 
  getCurrentDate, 
  formatDateForInput, 
  formatDateForDisplay, 
  getFormattedToday 
} from '../../utils/date';
import { 
  formatForInput, 
  formatForStorage, 
  getCurrentDateFormatted 
} from '../../utils/dateUtils';

const PurchaseForm = ({ onClose, initialData, isEdit }) => {
  const { setPurchase, addPurchase } = useAppContext();

  // Update form initialization with proper date handling
  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: isEdit ? {
      supplierName: initialData?.supplier || '',
      supplierAddress: initialData?.supplierAddress || '',
      invoiceNumber: initialData?.orderNumber || '',
      date: formatForInput(initialData?.date) || formatForInput(getCurrentDateFormatted()),
      items: initialData?.items || [{
        productId: '',
        productName: '',
        bagSize: '',
        pricePerQuintal: '',
        quantity: ''
      }],
      paymentDate: formatDateForInput(new Date()),
      newPaymentAmount: '',
      paymentMethod: 'CASH',
      transactionId: ''
    } : {
      supplierName: '',
      supplierAddress: '',
      invoiceNumber: getCurrentCounter(), // Now visible on form load
      date: formatForInput(getCurrentDateFormatted()),
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
        date: formatForStorage(data.date),
        // ... rest of the submission logic ...
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
            date: data.paymentDate
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
          date: formatDateForDisplay(data.date),
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
            date: formatDateForDisplay(data.date)
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
    <div className={modalStyles.overlay}>
      <div className={modalStyles.container}>
        <div className={modalStyles.content}>
          <button onClick={onClose} className={modalStyles.closeButton}>
            <X className="h-6 w-6" />
          </button>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {isEdit ? 'Update Payment' : 'New Purchase Order'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {isEdit ? (
                <>
                  {/* Purchase Details Section (Read-only) */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Order Number</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          #{initialData.orderNumber}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Purchase Date</label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatDateForInput(initialData.date)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Supplier Details</label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {initialData.supplier}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {initialData.supplierAddress || 'No address provided'}
                      </p>
                    </div>

                    {/* Items List */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">
                        Items Purchased
                      </label>
                      <div className="space-y-2">
                        {initialData.items.map((item, idx) => (
                          <div key={idx} className="bg-white dark:bg-gray-700/50 p-3 rounded-md">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-gray-500">
                                  {item.bagSize}kg × {item.quantity} bags
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₹{item.pricePerQuintal}/qtl</p>
                                <p className="text-sm text-gray-500">
                                  Total: ₹{((item.bagSize * item.quantity * item.pricePerQuintal) / 100).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Total Amount</label>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            ₹{initialData.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <label className="text-sm font-medium text-gray-500">Remaining Amount</label>
                          <p className="text-xl font-bold text-red-600">
                            ₹{calculateRemainingAmount().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">
                        Payment History
                      </label>
                      <div className="space-y-2">
                        {(initialData.paymentHistory || []).map((payment, idx) => (
                          <div key={idx} className="bg-white dark:bg-gray-700/50 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">{payment.type}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  {formatDateForInput(payment.date)}
                                </p>
                                {payment.transactionRef && (
                                  <p className="text-xs text-gray-500">
                                    Ref: {payment.transactionRef}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Payment Update Form */}
                  {calculateRemainingAmount() > 0 ? (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Update Payment
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={formClasses.label}>Payment Amount</label>
                          <input
                            type="number"
                            {...register('newPaymentAmount')}
                            max={calculateRemainingAmount()}
                            placeholder={`Max: ₹${calculateRemainingAmount().toLocaleString()}`}
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
                        
                        {watch('paymentMethod') !== 'CASH' && (
                          <div className="col-span-2">
                            <label className={formClasses.label}>Transaction ID</label>
                            <input
                              type="text"
                              {...register('transactionId')}
                              placeholder="Enter transaction reference"
                              className={formClasses.input}
                            />
                          </div>
                        )}

                        <div className="col-span-2">
                          <label className={formClasses.label}>Payment Date</label>
                          <input
                            type="date"
                            {...register('paymentDate')}
                            className={formClasses.input}
                            defaultValue={formatDateForInput(new Date())}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        Full payment has been received for this purchase order
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Basic Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className={formClasses.label}>Supplier Name</label>
                      <input
                        type="text"
                        {...register('supplierName', { required: true })}
                        className={`${formClasses.input} h-12`}
                        placeholder="Enter supplier name"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className={formClasses.label}>Supplier Address</label>
                      <textarea
                        {...register('supplierAddress')}
                        rows={3}
                        className={`${formClasses.input} h-12`}
                        placeholder="Enter complete address"
                      />
                    </div>

                    <div>
                      <label className={formClasses.label}>Invoice Number</label>
                      <input
                        type="text"
                        {...register('invoiceNumber')}
                        className={`${formClasses.input} bg-gray-100 h-12`}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className={formClasses.label}>Purchase Date</label>
                      <input
                        type="date"
                        {...register('date')}
                        className={`${formClasses.input} h-12`}
                        defaultValue={getFormattedToday()}
                        onChange={(e) => {
                          const formattedDate = formatDateForDisplay(e.target.value);
                          setValue('date', e.target.value); // Keep the input value in yyyy-mm-dd
                        }}
                      />
                    </div>
                  </div>

                  {/* Existing Items Section */}
                  {!isEdit && (
                    <>
                      {/* Items Section */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className={formClasses.label}>Items</label>
                          <button
                            type="button"
                            onClick={() => append({
                              productName: '',
                              bagSize: '',
                              pricePerQuintal: '',
                              quantity: ''
                            })}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/70 rounded-md transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </button>
                        </div>

                        {/* Products List */}
                        {fields.map((field, index) => renderItemFields(index, field))}

                        {/* Main Totals Display - Show as soon as any item has data */}
                        {watchedItems?.some(item => 
                          item.bagSize || item.quantity || item.pricePerQuintal
                        ) && (
                          <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Total Weight</p>
                                <p className="text-xl font-bold">{runningTotals.weight.toFixed(2)} kg</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-xl font-bold">₹{runningTotals.amount.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Payment Section */}
                      <div className="border-t pt-4 mt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Payment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={formClasses.label}>Initial Payment</label>
                            <input
                              type="number"
                              {...register('initialPayment')}
                              max={runningTotals.amount}
                              placeholder={`Max: ₹${runningTotals.amount.toLocaleString('en-IN')}`}
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
                          
                          {watch('paymentMethod') !== 'CASH' && (
                            <div className="col-span-2">
                              <label className={formClasses.label}>Transaction ID</label>
                              <input
                                type="text"
                                {...register('transactionId')}
                                placeholder="Enter transaction reference"
                                className={formClasses.input}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Updated Form Actions */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 mt-6">
                <div className="flex justify-end space-x-4">
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
                    {isEdit ? 'Update Payment' : 'Create Purchase'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;
