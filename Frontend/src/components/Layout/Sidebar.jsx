import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Boxes,
  ClipboardList,
  Settings,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  // Menu items configuration
  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Products', icon: Package, path: '/products' },
    { title: 'Sales', icon: ShoppingCart, path: '/sales' },
    { title: 'Customers', icon: Users, path: '/customers' },
    { title: 'Stock', icon: Boxes, path: '/stock' },
    { title: 'Purchase', icon: ClipboardList, path: '/purchase' },
    { title: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-3"
        >
          <span className="text-xl font-semibold text-indigo-600">KLS Enterprise</span>
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation section */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }
                `}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                  }`}
                />
                {item.title}
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