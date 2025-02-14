import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DashboardLayout from './components/Layout/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Stock from './pages/Stock';
import Purchase from './pages/Purchase'; // Updated import

function App() {
  return (
    <BrowserRouter>
      <div className="app" style={{ WebkitTapHighlightColor: 'transparent' }}>
        <AuthProvider>
          <AppProvider>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Redirect root to welcome */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products/*" element={<Products />} />
                  <Route path="/sales/*" element={<Sales />} />
                  <Route path="/customers/*" element={<Customers />} />
                  <Route path="/stock/*" element={<Stock />} />
                  <Route path="/purchase/*" element={<Purchase />} />
                </Route>
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;