import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Package, ShoppingCart, Users, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  
  // Split navigation into main and secondary
  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Rate Chart', href: '/rate-chart', icon: TrendingUp },
    { name: 'Sales', href: '/sales', icon: Package },
    { name: 'Purchase', href: '/purchase', icon: ShoppingCart },
  ];

  const secondaryNavigation = [
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Suppliers', href: '/suppliers', icon: Truck }
  ];

  const NavLink = ({ item }) => (
    <Link
      to={item.href}
      className={`
        group flex items-center px-3 py-2 text-sm font-medium rounded-md
        ${location.pathname === item.href 
          ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }
      `}
    >
      <item.icon 
        className={`mr-3 h-5 w-5 flex-shrink-0 ${
          location.pathname === item.href 
            ? 'text-indigo-600 dark:text-indigo-300' 
            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500'
        }`}
      />
      {item.name}
    </Link>
  );

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo section */}
      <div className="flex h-16 items-center px-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
            KLS Enterprise
          </span>
        </Link>
      </div>

      {/* Main Navigation - Top */}
      <div className="px-2 pt-4">
        <nav className="space-y-1">
          {mainNavigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
      </div>

      {/* Secondary Navigation - More towards bottom with Divider */}
      <div className="flex-1 flex flex-col justify-end px-2 mb-20"> {/* Changed justify-center to justify-end and added mb-20 */}
        <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6" /> {/* Increased margin bottom */}
        <nav className="space-y-2"> {/* Reduced space between items */}
          {secondaryNavigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
      </div>

      {/* User Profile Section - Fixed Bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name?.[0].toUpperCase() || '?'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;