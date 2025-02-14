import { useAppContext } from '../context/AppContext';
import { DollarSign, Package, Users } from 'lucide-react';

const Dashboard = () => {
  const { sales, purchase, products, customers } = useAppContext();

  // Calculate today's sales
  const todaySales = sales
    .filter(sale => new Date(sale.date).toDateString() === new Date().toDateString())
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  // Calculate total Purchase amount of today
  const totalPurchase = purchase.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const stats = [
    {
      title: "Today's Sales",
      value: `₹${todaySales.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: "Total Purchase",
      value: `₹${totalPurchase.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Customers',
      value: customers.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sales Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Sales</h2>
          <div className="mt-4">
            {sales.slice(0, 5).map((sale, index) => (
              <div key={index} className="border-t border-gray-200 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
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
