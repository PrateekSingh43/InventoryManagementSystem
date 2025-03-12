import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [loading, setLoading] = useState(true); // Add loading state

  const navigate = useNavigate();
  const location = useLocation();

  // Handle initial routing
  useEffect(() => {
    const publicPaths = ['/welcome', '/login'];
    const currentPath = location.pathname;

    if (!isAuthenticated && !publicPaths.includes(currentPath)) {
      navigate('/welcome');
    }
  }, [isAuthenticated, location, navigate]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.setItem('isAuthenticated', 'false');
    }
  }, [user]);

  useEffect(() => {
    // Check for saved user data when app starts
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // Mark initial load complete
  }, []);

  const login = async (email, password, role) => {
    const mockUser = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role
    };

    try {
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Log the activity directly to localStorage
      const loginLog = {
        id: Date.now(),
        type: 'AUTH',
        timestamp: new Date(),
        description: 'User Login',
        details: `${email} logged in as ${role}`,
        user: mockUser.name
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
      localStorage.setItem('activityLogs', JSON.stringify([loginLog, ...existingLogs]));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      // Log the logout activity
      if (user) {
        const logoutLog = {
          id: Date.now(),
          type: 'AUTH',
          timestamp: new Date(),
          description: 'User Logout',
          details: `${user.email} logged out`,
          user: user.name
        };
        
        const existingLogs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        localStorage.setItem('activityLogs', JSON.stringify([logoutLog, ...existingLogs]));
      }

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.setItem('isAuthenticated', 'false');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      loading // Provide loading state to consumers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
