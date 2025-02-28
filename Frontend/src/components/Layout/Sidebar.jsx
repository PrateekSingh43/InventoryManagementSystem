import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Users, 
  Truck,
  Menu,
  TrendingUp,
  Package
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Purchase', href: '/purchase', icon: ShoppingCart },
    { name: 'Sales', href: '/sales', icon: Package },
    { name: 'Rate Chart', href: '/rate-chart', icon: TrendingUp },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Suppliers', href: '/suppliers', icon: Truck }
  ];

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-3"
        >
          <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">KLS Enterprise</span>
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation section */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-200' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile section */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">
                {localStorage.getItem('user') 
                  ? JSON.parse(localStorage.getItem('user')).name?.charAt(0)
                  : 'U'
                }
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {localStorage.getItem('user') 
                ? JSON.parse(localStorage.getItem('user')).name
                : 'User'
              }
            </p>
            <p className="text-xs text-gray-500">
              {localStorage.getItem('user') 
                ? JSON.parse(localStorage.getItem('user')).role
                : 'Role'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;