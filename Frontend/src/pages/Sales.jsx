import { useState } from 'react';
import { Search, FileText, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sales = () => {
  const { sales, setSales, customers, products } = useAppContext();
  const [showNewSale, setShowNewSale] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSale, setCurrentSale] = useState({
    customer: null,
    items: [],
    totalAmount: 0,
    paidAmount: 0,
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: `INV-${Date.now()}`
  });

  const filteredSales = sales.filter(sale =>
    sale.invoiceNumber.includes(searchTerm) ||
    (sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddItem = (product, variant) => {
    if (variant.currentStock <= 0) {
      alert('Product out of stock!');
      return;
    }

    const newItems = [...currentSale.items];
    const existingItem = newItems.find(item => 
      item.productId === product.id && item.variantId === variant.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newItems.push({
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        bagSize: variant.bagSize,
        pricePerQuintal: variant.pricePerQuintal,
        quantity: 1
      });
    }

    updateSaleTotal(newItems);
  };

  const updateSaleTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const pricePerBag = (item.bagSize / 100) * item.pricePerQuintal;
      return sum + (pricePerBag * item.quantity);
    }, 0);

    setCurrentSale(prev => ({
      ...prev,
      items,
      totalAmount: total
    }));
  };

  const handleSaveInvoice = () => {
    if (currentSale.customer?.type === 'regular') {
      const pendingAmount = currentSale.totalAmount - currentSale.paidAmount;
      const newTotalCredit = (currentSale.customer.currentCredit || 0) + pendingAmount;
      
      if (newTotalCredit > currentSale.customer.creditLimit) {
        alert('This sale exceeds customer credit limit!');
        return;
      }
    }

    const newSale = {
      ...currentSale,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      customerName: currentSale.customer?.name || 'Walk-in Customer',
      customerId: currentSale.customer?.id,
      status: currentSale.paidAmount >= currentSale.totalAmount ? 'PAID' : 'PENDING'
    };

    setSales(prev => [...prev, newSale]);
    setShowNewSale(false);
    setCurrentSale({
      customer: null,
      items: [],
      totalAmount: 0,
      paidAmount: 0,
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${Date.now()}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Sales</h1>
        <button
          onClick={() => setShowNewSale(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Sale
        </button>
      </div>

      {showNewSale ? (
        <div className="bg-white shadow sm:rounded-lg p-8">
          <div className="grid grid-cols-3 gap-7">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                onChange={(e) => {
                  const customer = customers.find(c => c.id === e.target.value);
                  setCurrentSale(prev => ({ ...prev, customer }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
              <input
                type="text"
                value={currentSale.invoiceNumber}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Products</h3>
            <div className="mt-4 grid grid-cols-1 gap-4">
              {products.map(product => (
                <div key={product.id} className="border rounded-lg p-4">
                  <h4 className="font-medium">{product.name}</h4>
                  <div className="mt-2 grid grid-cols-4 gap-4">
                    {product.variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => handleAddItem(product, variant)}
                        className={`p-2 text-sm rounded-md ${
                          variant.currentStock > 0
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-red-50 text-red-700'
                        }`}
                        disabled={variant.currentStock <= 0}
                      >
                        {variant.bagSize}kg - ₹{variant.pricePerQuintal}/q
                        <br />
                        Stock: {variant.currentStock}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Selected Items</h3>
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bag Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentSale.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.bagSize}kg</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...currentSale.items];
                            newItems[index].quantity = parseInt(e.target.value) || 0;
                            updateSaleTotal(newItems);
                          }}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{item.pricePerQuintal}/q</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{((item.bagSize / 100) * item.pricePerQuintal * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
              <input
                type="number"
                value={currentSale.paidAmount}
                onChange={(e) => setCurrentSale(prev => ({ ...prev, paidAmount: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                Total: ₹{currentSale.totalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Balance: ₹{(currentSale.totalAmount - currentSale.paidAmount).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowNewSale(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveInvoice}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save Invoice
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center px-4 py-2 border rounded-md bg-white">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 flex-1 outline-none"
            />
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sale.status === 'PAID' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <FileText className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Sales;