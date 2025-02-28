import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Menu, User, Sun, Moon, 
  Activity, HelpCircle, LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Calculator from '../common/Calculator';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getThemeToggleText = () => {
    return `Switch to ${isDark ? 'Light' : 'Dark'} Mode`;
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.shiftKey && e.key === 'A') {
        setIsDropdownOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex justify-between h-16 items-center px-4 sm:px-6 lg:px-8">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1 px-4 flex justify-end items-center space-x-4">
          <Calculator />
          <div className="max-w-lg w-full lg:max-w-sm">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              </div>
            </div>
          </div>

          <button className="p-1 rounded-full text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell className="h-6 w-6" />
          </button>

          {/* User Dropdown */}
          <div className="relative user-dropdown">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getUserInitials(user?.name)}
                </span>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                {/* Profile Overview */}
                <div className="px-4 py-3 border-b dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <MenuItem icon={User} text="Profile" onClick={() => {}} />
                  <MenuItem 
                    icon={isDark ? Sun : Moon} 
                    text={getThemeToggleText()}
                    onClick={toggleTheme} 
                  />
                  <MenuItem icon={Activity} text="View Activity Log" onClick={() => {}} />
                  <MenuItem icon={Bell} text="Notifications" onClick={() => {}} />
                  <MenuItem icon={HelpCircle} text="Support & Help" onClick={() => {}} />
                  
                  {/* Logout */}
                  <div className="border-t dark:border-gray-700">
                    <MenuItem 
                      icon={LogOut} 
                      text="Logout" 
                      onClick={handleLogout}
                      className="text-red-600 dark:text-red-400" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const MenuItem = ({ icon: Icon, text, onClick, className = '' }) => (
  <button
    className={`w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${className}`}
    onClick={onClick}
  >
    <Icon className="mr-3 h-5 w-5" />
    {text}
  </button>
);

export default Header;