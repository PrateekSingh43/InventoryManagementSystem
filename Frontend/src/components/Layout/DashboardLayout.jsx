import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../../pages/Dashboard';
import Sales from '../../pages/Sales';
import Customers from '../../pages/Customers';
import Suppliers from '../../pages/Suppliers';
import Purchase from '../../pages/Purchase';
import RateChart from '../../pages/RateChart'; // New RateChart page

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-dark-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 overflow-auto">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sales/*" element={<Sales />} />
            <Route path="customers/*" element={<Customers />} />
            <Route path="suppliers/*" element={<Suppliers />} />
            <Route path="purchase/*" element={<Purchase />} />
            <Route path="rate-chart" element={<RateChart />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;