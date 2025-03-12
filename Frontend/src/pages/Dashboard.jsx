import React from 'react';
import * as AppContext from '../context/AppContext.jsx'; // Use explicit extension and import all
import { DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { purchase, sales } = AppContext.useAppContext();
  const navigate = useNavigate();

  // Compute today's sales and pending payments
  const todayStr = new Date().toDateString();
  const todaysSales = sales.filter(sale => new Date(sale.date).toDateString() === todayStr);
  const todaysSalesTotal = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const pendingPayments = sales
    .filter(sale => sale.status === 'PENDING')
    .reduce((sum, sale) => sum + (sale.totalAmount - sale.paidAmount), 0);

  const stats = [
    {
      title: "Today's Sales",
      value: `₹${todaysSalesTotal.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: "Pending Payments",
      value: `₹${pendingPayments.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sales Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Sales</h2>
          <div className="mt-4">
            {todaysSales.slice(0, 5).map((sale, index) => (
              <div key={index} className="border-t border-gray-200 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Invoice #{sale.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-green-600">
                    ₹{sale.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
