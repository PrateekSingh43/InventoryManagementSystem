import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div 
      className="min-h-screen bg-gray-100" 
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        outline: 'none'
      }}
    >
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className={`fixed inset-0 flex z-40 transition-all transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="relative flex-1 flex flex-col w-64 bg-white">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-col ${isSidebarOpen ? 'lg:pl-64' : ''}`}>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;