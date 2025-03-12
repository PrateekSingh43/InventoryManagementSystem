import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { formatDateForInput } from '../../utils/dateFormatter';
import DateDisplay from '../common/DateDisplay';

const PurchaseCard = ({ purchase, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setPurchase } = useAppContext();

  // Add validation for purchase object
  if (!purchase) {
    return null;
  }

  // Format numbers consistently
  const formatCurrency = (amount) => {
    return typeof amount === 'number' 
      ? `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
      : '₹0.00';
  };

  // Modified date formatting function
  const formatDate = (dateString) => {
    try {
      // Ensure we're handling the date in local timezone
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: "bg-green-50 text-green-700 border-green-100",
      partial: "bg-yellow-50 text-yellow-700 border-yellow-100",
      unpaid: "bg-red-50 text-red-700 border-red-100"
    };
    return badges[status] || badges.unpaid;
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      setPurchase(prev => prev.filter(p => p.id !== purchase.id));
      toast.success('Purchase order deleted');
    }
  };

  const getPaymentHistoryElement = () => (
    <div className="space-y-2">
      {purchase.paymentHistory?.map((payment, idx) => (
        <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">₹{payment.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{payment.type}</p>
            </div>
            <p className="text-xs text-gray-500">
              {format(parseISO(payment.date), 'dd MMM yyyy')}
            </p>
          </div>
          {payment.transactionRef && (
            <p className="text-xs text-gray-500 mt-1">
              Ref: {payment.transactionRef}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  // Modified getItemsSummary
  const getItemsSummary = () => {
    if (!Array.isArray(purchase.items) || purchase.items.length === 0) {
      return (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          No items available
        </div>
      );
    }

    if (!isExpanded) {
      const firstItem = purchase.items[0];
      const remainingCount = purchase.items.length - 1;
      return (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <p>{firstItem.productName} ({firstItem.bagSize}kg × {firstItem.quantity})</p>
          {remainingCount > 0 && (
            <p>+{remainingCount} more {remainingCount === 1 ? 'item' : 'items'}</p>
          )}
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Items Purchased:</h4>
        {purchase.items.map((item, idx) => (
          <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.productName}
                </p>
                <p className="text-sm text-gray-500">
                  {item.bagSize}kg × {item.quantity} bags
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  ₹{item.pricePerQuintal}/qtl
                </p>
                <p className="text-xs text-gray-500">
                  Total: ₹{((item.bagSize * item.quantity * item.pricePerQuintal) / 100).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Modified supplier info display
  const getSupplierInfo = () => (
    <div className="mb-3">
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        From: {purchase.supplier}
        {purchase.supplierAddress && (
          <span className="text-gray-500 ml-1">({purchase.supplierAddress})</span>
        )}
      </p>
    </div>
  );

  // Add proper payment calculation
  const getTotalPaid = () => {
    return (purchase.paymentHistory || [])
      .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
  };

  const getRemainingAmount = () => {
    const totalPaid = getTotalPaid();
    return purchase.totalAmount - totalPaid;
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow">
      {/* Main Content */}
      <div className="p-4">
        {/* Header with Order Number and Date */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order #{purchase.orderNumber}
            </h3>
            <DateDisplay date={purchase.date} />
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(purchase.status)}`}>
            {purchase.status}
          </span>
        </div>

        {/* Updated Supplier Info */}
        {getSupplierInfo()}

        {/* Items Summary */}
        {getItemsSummary()}

        {/* Amounts */}
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Amount:</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(purchase.totalAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Remaining:</p>
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(getRemainingAmount())}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {/* Remove supplier address section and only keep payment history */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Payment History
            </h4>
            {getPaymentHistoryElement()}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(purchase)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/50 dark:hover:bg-indigo-900"
            >
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-300 dark:bg-red-900/50 dark:hover:bg-red-900"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* View More/Less Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 text-sm text-indigo-600 dark:text-indigo-400 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-b-xl flex items-center justify-center"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4 mr-1" /> View Less
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-1" /> View More
          </>
        )}
      </button>
    </div>
  );
};

export default PurchaseCard;
