import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formClasses } from '../common/FormStyles';
import { modalStyles } from '../common/ModalStyles';
import { toast } from 'react-hot-toast';
import { formatDateForInput } from '../../utils/dateFormatter';
import { generateInvoiceNumber, getCurrentCounter } from '../../utils/invoiceGenerator';

const PurchaseForm = ({ onClose, initialData, isEdit }) => {
  const { setPurchase, products, suppliers, setSuppliers } = useAppContext();
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Add proper date handling
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Update the form initialization
  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: isEdit ? {
      supplierName: initialData?.supplier || '',
      supplierAddress: initialData?.supplierAddress || '',
      invoiceNumber: initialData?.orderNumber || '',
      date: initialData?.date || getCurrentDate(),
      items: initialData?.items || [{
        productId: '',
        productName: '',
        bagSize: '',
        pricePerQuintal: '',
        quantity: ''
      }],
      paymentDate: new Date().toISOString().split('T')[0],
      newPaymentAmount: '',
      paymentMethod: 'CASH',
      transactionId: ''
    } : {
      supplierName: '',
      supplierAddress: '',
      invoiceNumber: getCurrentCounter(), // Now visible on form load
      date: getCurrentDate(),
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

  // Updated product handlers - removed console.logs
  const handleProductNameSelection = (index, productName) => {
    if (!productName) {
      setValue(`items.${index}.productName`, '');
      setValue(`items.${index}.bagSize`, '');
      setValue(`items.${index}.pricePerQuintal`, '');
      setValue(`items.${index}.quantity`, '');
      return;
    }
    setValue(`items.${index}.productName`, productName);
    setValue(`items.${index}.bagSize`, ''); // Reset bag size when product changes
  };

  const handleBagSizeSelection = (index, bagSize) => {
    if (!bagSize) return;
    setValue(`items.${index}.bagSize`, parseFloat(bagSize));
  };

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

  const onSubmit = async (data) => {
    try {
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
        const { weight, amount } = calculateTotals(data.items);
        const initialPayment = parseFloat(data.initialPayment) || 0;
        const orderNumber = generateInvoiceNumber();

        // Create purchase transaction
        const purchaseTransaction = {
          id: Date.now().toString(),
          type: 'PURCHASE',
          date: data.date,
          description: `Purchase Order #${orderNumber}`,
          debit: amount,
          credit: initialPayment,
          details: {
            orderNumber,
            items: data.items.map(item => ({
              productName: item.productName,
              bagSize: parseFloat(item.bagSize),
              quantity: parseFloat(item.quantity),
              pricePerQuintal: parseFloat(item.pricePerQuintal)
            }))
          }
        };

        // Update supplier with the new transaction
        setSuppliers(prev => {
          const existingSupplier = prev.find(s => s.name === data.supplierName);
          if (existingSupplier) {
            return prev.map(s => {
              if (s.name === data.supplierName) {
                const transactions = [...(s.transactions || []), purchaseTransaction];
                return { ...s, transactions };
              }
              return s;
            });
          } else {
            // Create new supplier with this transaction
            return [...prev, {
              id: Date.now().toString(),
              name: data.supplierName,
              address: data.supplierAddress,
              openingBalance: 0,
              transactions: [purchaseTransaction]
            }];
          }
        });

        // Create purchase order
        const purchaseData = {
          id: Date.now().toString(),
          orderNumber: generateInvoiceNumber(),
          supplier: data.supplierName,
          supplierAddress: data.supplierAddress,
          date: data.date,
          items: data.items.map(item => ({
            ...item,
            bagSize: parseFloat(item.bagSize),
            pricePerQuintal: parseFloat(item.pricePerQuintal),
            quantity: parseFloat(item.quantity)
          })),
          totalQuantityKg: weight,
          totalAmount: amount,
          remainingAmount: amount - initialPayment,
          status: initialPayment === amount ? 'paid' : 
                 initialPayment === 0 ? 'unpaid' : 'partial',
          paymentHistory: initialPayment > 0 ? [{
            amount: initialPayment,
            type: data.paymentMethod,
            transactionRef: data.paymentMethod !== 'CASH' ? data.transactionId : null,
            date: data.date
          }] : []
        };

        // Add explicit localStorage save after setting purchase
        setPurchase(prev => {
          const newPurchases = [...prev, purchaseData];
          localStorage.setItem('purchases', JSON.stringify(newPurchases));
          return newPurchases;
        });

        toast.success('Purchase order created successfully');
      }
      onClose();
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

  const calculateItemTotal = (bagSize, quantity, pricePerQuintal) => {
    if (!bagSize || !quantity || !pricePerQuintal) return null;
    const weight = parseFloat(bagSize) * parseFloat(quantity);
    const price = (weight / 100) * parseFloat(pricePerQuintal);
    return { weight, price };
  };

  const handleItemChange = (index) => {
    const bagSize = watch(`items.${index}.bagSize`);
    const quantity = watch(`items.${index}.quantity`);
    const pricePerQuintal = watch(`items.${index}.pricePerQuintal`);
    
    calculateItemTotal(bagSize, quantity, pricePerQuintal);
  };

  // Updated renderProductFields function
  const renderProductFields = (index, field) => {
    const bagSize = parseFloat(watch(`items.${index}.bagSize`) || 0);
    const quantity = parseFloat(watch(`items.${index}.quantity`) || 0);
    const pricePerQuintal = parseFloat(watch(`items.${index}.pricePerQuintal`) || 0);
    
    // Calculate item total using regular function
    const itemTotal = calculateItemTotal(bagSize, quantity, pricePerQuintal);

    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Product Selection */}
          <div className="col-span-4">
            <label className={formClasses.label}>Product Name</label>
            <select
              className={formClasses.select}
              value={watch(`items.${index}.productName`) || ''}
              onChange={(e) => handleProductNameSelection(index, e.target.value)}
            >
              <option value="">Select Product</option>
              {[...new Set(products.map(p => p.name))].sort().map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Bag Size Selection */}
          <div className="col-span-2">
            <label className={formClasses.label}>Bag Size</label>
            <select
              className={formClasses.select}
              value={watch(`items.${index}.bagSize`) || ''}
              onChange={(e) => handleBagSizeSelection(index, e.target.value)}
              disabled={!watch(`items.${index}.productName`)}
            >
              <option value="">Select Size</option>
              {watch(`items.${index}.productName`) && 
                products
                  .find(p => p.name === watch(`items.${index}.productName`))
                  ?.bagSizes.map(size => (
                    <option key={size} value={size}>{size} kg</option>
                  ))
              }
            </select>
          </div>

          {/* Price Input - 3 columns */}
          <div className="col-span-3">
            <label className={formClasses.label}>Price/Quintal</label>
            <input
              type="number"
              {...register(`items.${index}.pricePerQuintal`)}
              className={formClasses.input}
              placeholder="₹ Price/Quintal"
            />
          </div>

          {/* Quantity Input with Preview */}
          <div className="col-span-3 space-y-2">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <label className={formClasses.label}>Quantity</label>
                <input
                  type="number"
                  {...register(`items.${index}.quantity`)}
                  className={formClasses.input}
                  placeholder="Number of bags"
                  onChange={(e) => {
                    register(`items.${index}.quantity`).onChange(e);
                  }}
                />
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-8 p-2 text-red-600 hover:text-red-900"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {/* Item Preview */}
            {itemTotal && (
              <div className="text-xs bg-white dark:bg-gray-700/50 p-2 rounded-md shadow-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Total Weight:</span>
                  <span className="font-medium">{itemTotal.weight.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Amount:</span>
                  <span className="font-medium">₹{itemTotal.price.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Updated supplier section with dropdown
  const renderSupplierSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className={formClasses.label}>Select Supplier</label>
        <select
          {...register('supplierName', { required: 'Supplier is required' })}
          className={formClasses.select}
          onChange={(e) => handleSupplierSelect(e.target.value)}
        >
          <option value="">Select a supplier</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.name}>
              {supplier.name}
            </option>
          ))}
        </select>
        {suppliers.length === 0 && (
          <p className="mt-1 text-sm text-red-500">
            No suppliers available. Please add suppliers first.
          </p>
        )}
      </div>
      
      {selectedSupplier && (
        <div className="col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900 dark:text-white">{selectedSupplier.address || 'No address provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contact</label>
              <p className="text-gray-900 dark:text-white">{selectedSupplier.contact || 'No contact provided'}</p>
            </div>
            {selectedSupplier.gstNumber && (
              <div>
                <label className="text-sm font-medium text-gray-500">GST Number</label>
                <p className="text-gray-900 dark:text-white">{selectedSupplier.gstNumber}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Update handleSupplierSelect
  const handleSupplierSelect = (supplierName) => {
    const supplier = suppliers.find(s => s.name === supplierName);
    if (supplier) {
      setSelectedSupplier(supplier);
      setValue('supplierName', supplier.name);
      setValue('supplierAddress', supplier.address || '');
    } else {
      setSelectedSupplier(null);
      setValue('supplierAddress', '');
    }
  };

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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {renderSupplierSection()}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={formClasses.label}>Invoice Number</label>
                      <input
                        type="text"
                        {...register('invoiceNumber')}
                        className={`${formClasses.input} bg-gray-100`}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className={formClasses.label}>Purchase Date</label>
                      <input
                        type="date"
                        {...register('date')}
                        className={formClasses.input}
                        defaultValue={formatDateForInput(new Date())}
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
                              productId: '',
                              productName: '',
                              bagSize: '',
                              pricePerQuintal: '',
                              quantity: ''
                            })}
                            className={formClasses.addButton}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Item
                          </button>
                        </div>

                        {/* Products List */}
                        {fields.map((field, index) => renderProductFields(index, field))}

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

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;
