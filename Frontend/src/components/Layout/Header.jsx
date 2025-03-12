import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Menu, User, Sun, Moon, 
  HelpCircle, LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Calculator from '../common/Calculator';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          
        </div>

        {/* Right Section - Now better spaced without search bar */}
        <div className="flex items-center space-x-6">
          <Calculator />

          <button 
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* Updated User Dropdown */}
          <div className="relative user-dropdown">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getUserInitials(user?.name)}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50">
                {/* Profile Overview */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <MenuItem 
                    icon={User} 
                    text="Profile" 
                    onClick={() => {}}
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  />
                  <MenuItem 
                    icon={isDark ? Sun : Moon} 
                    text={getThemeToggleText()}
                    onClick={toggleTheme}
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  />
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

// Updated MenuItem component with dark mode support
const MenuItem = ({ icon: Icon, text, onClick, className = '' }) => (
  <button
    className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
    onClick={onClick}
  >
    <Icon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
    <span className="text-gray-700 dark:text-gray-200">{text}</span>
  </button>
);

export default Header;