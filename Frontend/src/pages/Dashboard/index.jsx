import { useAppContext } from '../../context/AppContext';
import { 
  IndianRupee,
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Dashboard = () => {
  const { sales, stock, customers } = useAppContext();

  // Calculate today's metrics
  const today = new Date().toISOString().split('T')[0];
  
  const todaysSales = sales.filter(sale => sale.date.includes(today));
  const todaysSalesTotal = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const pendingPayments = sales
    .filter(sale => sale.status === 'PENDING')
    .reduce((sum, sale) => sum + (sale.totalAmount - sale.paidAmount), 0);

  // Calculate month's performance
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthSales = sales
    .filter(sale => sale.date.startsWith(thisMonth))
    .reduce((sum, sale) => sum + sale.totalAmount, 0);
  
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.toISOString().slice(0, 7);
  const lastMonthSales = sales
    .filter(sale => sale.date.startsWith(lastMonth))
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  const salesGrowth = lastMonthSales ? 
    ((monthSales - lastMonthSales) / lastMonthSales) * 100 : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Today's Sales"
          value={`₹${todaysSalesTotal.toLocaleString()}`}
          icon={IndianRupee}
          color="blue"
          subtitle={`${todaysSales.length} transactions`}
        />
        <DashboardCard
          title="Total Customers"
          value={customers.length}
          icon={Users}
          color="green"
        />
        <DashboardCard
          title="Pending Payments"
          value={`₹${pendingPayments.toLocaleString()}`}
          icon={IndianRupee}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Monthly Performance</h2>
            <GrowthIndicator value={salesGrowth} />
          </div>
          <p className="mt-2 text-3xl font-bold">₹{monthSales.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Compared to ₹{lastMonthSales.toLocaleString()} last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <RecentTransactions sales={todaysSales.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
};

// Separate components for better organization
const GrowthIndicator = ({ value }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
    value >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {value >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
    {Math.abs(value).toFixed(1)}%
  </span>
);

const RecentTransactions = ({ sales }) => (
  <div className="space-y-4">
    {sales.map(sale => (
      <TransactionItem key={sale.id} sale={sale} />
    ))}
  </div>
);

const TransactionItem = ({ sale }) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="font-medium">{sale.customerName}</p>
      <p className="text-sm text-gray-500">Invoice #{sale.invoiceNumber}</p>
    </div>
    <StatusBadge status={sale.status} amount={sale.totalAmount} />
  </div>
);

const StatusBadge = ({ status, amount }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
    status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }`}>
    ₹{amount.toLocaleString()}
  </span>
);

const DashboardCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700'
  };

  return (
    <div className={`rounded-lg shadow p-6 ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className={`rounded-md p-2 ${colorClasses[color]} bg-opacity-50`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
