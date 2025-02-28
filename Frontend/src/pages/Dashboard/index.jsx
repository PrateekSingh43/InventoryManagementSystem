import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { IndianRupee, DollarSign } from 'lucide-react';
import RateChartCard from './RateChartCard';

const Dashboard = () => {
  const { sales } = useAppContext();

  // Calculate today's metrics
  const today = new Date().toISOString().split('T')[0];
  const todaysSales = sales.filter(sale => sale.date.includes(today));
  const todaysSalesTotal = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const pendingPayments = sales
    .filter(sale => sale.status === 'PENDING')
    .reduce((sum, sale) => sum + (sale.totalAmount - sale.paidAmount), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Medium-sized cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Today's Sales"
          value={`₹${todaysSalesTotal.toLocaleString()}`}
          icon={DollarSign}
          color="blue"
          subtitle={`${todaysSales.length} transactions`}
        />
        <DashboardCard
          title="Pending Payments"
          value={`₹${pendingPayments.toLocaleString()}`}
          icon={IndianRupee}
          color="yellow"
        />
        {/* Rate Chart Card */}
        <RateChartCard />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <RecentTransactions sales={todaysSales.slice(0, 5)} />
      </div>
    </div>
  );
};

// Helper Components
const DashboardCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-center">
        <div className={`rounded-md p-2 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const RecentTransactions = ({ sales }) => (
  <div className="space-y-4">
    {sales.map(sale => (
      <div key={sale.id} className="flex justify-between items-center py-3 border-b dark:border-gray-700">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{sale.customerName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Invoice #{sale.invoiceNumber}</p>
        </div>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          ₹{sale.totalAmount.toLocaleString()}
        </div>
      </div>
    ))}
  </div>
);

export default Dashboard;
