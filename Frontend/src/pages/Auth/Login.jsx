import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/Auth/AuthLayout'; // Updated import path

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      await login(data.email, data.password, data.role); // Pass the role

      toast.success('Login successful');
      
      // Explicitly navigate to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      toast.error('Login failed: Invalid credentials');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Log in to manage your inventory efficiently"
      imageSrc="/assets/login-bg.jpg"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <select
              {...register('role', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="manager">Manager</option>
              <option value="boss">Boss</option>
            </select>
          </div>
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 transform hover:scale-[1.02]"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="text-center">
              <Link
                to="/signup"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don't have an account? Sign up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;