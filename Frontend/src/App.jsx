import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DashboardLayout from './components/Layout/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import Purchase from './pages/Purchase';  // Add this import

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ThemeProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                <Route path="purchase" element={<Purchase />} />
                {/* Dashboard routes will be nested here by DashboardLayout */}
              </Route>
            </Routes>
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;