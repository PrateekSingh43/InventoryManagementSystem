import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Download, Printer } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SupplierForm from '../../components/Supplier/SupplierForm';
import { generateLedgerPDF } from '../../utils/pdfGenerator';
import { isSameMonth, subMonths, isAfter } from 'date-fns';

const SupplierDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { suppliers, purchase } = useAppContext();
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const supplier = location.state?.supplier;

  // Redirect if no supplier data
  if (!supplier) {
    navigate('/suppliers');
    return null;
  }

  // Get latest transactions
  const transactions = supplier.transactions || [];
  const balance = transactions.reduce((acc, curr) => {
    return acc + (curr.credit || 0) - (curr.debit || 0);
  }, supplier.openingBalance || 0);

  const handleExportLedger = () => {
    generateLedgerPDF(supplier);
  };

  // Add purchase history filtering
  const supplierPurchases = purchase.filter(p => p.supplier === supplier.name);

  // Filter purchases based on status and date
  const filteredPurchases = useMemo(() => {
    let filtered = supplierPurchases;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      switch(dateFilter) {
        case 'thisMonth':
          filtered = filtered.filter(p => isSameMonth(new Date(p.date), today));
          break;
        case 'lastMonth':
          filtered = filtered.filter(p => isSameMonth(new Date(p.date), subMonths(today, 1)));
          break;
        case 'last3Months':
          filtered = filtered.filter(p => isAfter(new Date(p.date), subMonths(today, 3)));
          break;
      }
    }

    return filtered;
  }, [supplierPurchases, filterStatus, dateFilter]);

  // Calculate totals
  const totals = useMemo(() => {
    return {
      totalDebit: transactions.reduce((sum, t) => sum + (t.debit || 0), 0),
      totalCredit: transactions.reduce((sum, t) => sum + (t.credit || 0), 0),
      totalPurchases: supplierPurchases.length,
      paidAmount: supplierPurchases.reduce((sum, p) => 
        sum + (p.status === 'paid' ? p.totalAmount : 0), 0),
      pendingAmount: supplierPurchases.reduce((sum, p) => 
        sum + (p.remainingAmount || 0), 0)
    };
  }, [transactions, supplierPurchases]);

  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
          <div className="mt-2 flex justify-between">
            <div>
              <p className="text-red-600 font-medium">₹{totals.totalDebit.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Debit</p>
            </div>
            <div className="text-right">
              <p className="text-green-600 font-medium">₹{totals.totalCredit.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Credit</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Purchase Orders</h3>
          <div className="mt-2">
            <p className="text-xl font-semibold">{totals.totalPurchases}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
          <div className="mt-2 flex justify-between">
            <div>
              <p className="text-green-600 font-medium">₹{totals.paidAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Paid</p>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-medium">₹{totals.pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="all">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Header with Export Options */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/suppliers')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {supplier.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportLedger}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Download className="h-4 w-4" />
            Export Ledger
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Edit2 className="h-4 w-4" />
            Edit Details
          </button>
        </div>
      </div>

      {/* Updated Details Card with Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'transactions' 
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
            <button
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'purchases' 
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('purchases')}
            >
              Purchase Orders
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'transactions' ? (
            <div className="space-y-4">
              {supplier.transactions?.map((transaction, index) => (
                <div 
                  key={index}
                  className="border-b dark:border-gray-700 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-right ${
                      transaction.debit 
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      <p className="font-medium">
                        ₹{(transaction.debit || transaction.credit).toLocaleString()}
                      </p>
                      <p className="text-xs">
                        {transaction.debit ? 'Debit' : 'Credit'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No transactions yet
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPurchases.map((purchase) => (
                <div key={purchase.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Order #{purchase.orderNumber}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(purchase.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{purchase.totalAmount.toLocaleString()}</p>
                      <p className={`text-sm ${
                        purchase.status === 'paid' ? 'text-green-600' : 
                        purchase.status === 'partial' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {purchase.status.toUpperCase()}
                      </p>
                    </div>
                  
                    {/* Items Summary */}
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Items: {purchase.items.length}</p>
                      <p>Total Weight: {purchase.totalQuantityKg.toFixed(2)} kg</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPurchases.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No purchase orders found
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <SupplierForm
          initialData={supplier}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default SupplierDetails;
