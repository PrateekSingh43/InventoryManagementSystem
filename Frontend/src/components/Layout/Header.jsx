import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between h-16 items-center px-4 sm:px-6 lg:px-8">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1 px-4 flex justify-end items-center space-x-4">
          <div className="max-w-lg w-full lg:max-w-sm">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="ml-4 flex items-center space-x-4">
            <button className="bg-indigo-600 p-1.5 rounded-lg text-white hover:bg-indigo-700">
              <Bell className="h-5 w-5" />
            </button>

            <div className="border-l pl-4 flex items-center border-gray-200">
              <div className="text-sm">
                <span className="text-gray-900 font-medium block">{user?.name}</span>
                <span className="text-gray-500 text-xs">{user?.role}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="ml-4 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;