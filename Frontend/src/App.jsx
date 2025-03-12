import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import * as AppContext from './context/AppContext.jsx'; // Use explicit extension and import all
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Auth/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AppContext.AppProvider>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <div className="app">
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </AppContext.AppProvider>
  );
}

export default App;