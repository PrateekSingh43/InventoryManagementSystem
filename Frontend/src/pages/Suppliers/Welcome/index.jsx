import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to KLS Enterprise
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Hello, {user?.name || 'User'}!
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
};

export default Welcome;
