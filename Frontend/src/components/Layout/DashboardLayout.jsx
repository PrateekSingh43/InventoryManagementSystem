import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../../pages/Dashboard';
import RateChart from '../../pages/RateChart';
import Sales from '../../pages/Sales';
import Purchase from '../../pages/Purchase';
import Suppliers from '../../pages/Suppliers';
import Customers from '../../pages/Customers';
import SupplierDetails from '../../pages/Suppliers/SupplierDetails';

const DashboardLayout = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`h-screen flex overflow-hidden ${theme.background.tertiary}`}>
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className={`p-6 ${theme.background.tertiary}`}>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rate-chart" element={<RateChart />} />
            <Route path="sales/*" element={<Sales />} />
            <Route path="purchase/*" element={<Purchase />} />
            <Route path="suppliers/*" element={<Suppliers />} />
            <Route path="suppliers/:id/details" element={<SupplierDetails />} />
            <Route path="customers/*" element={<Customers />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;