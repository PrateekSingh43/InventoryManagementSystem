import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AuthLayout from '../context/AuthLayout';

const Welcome = () => {
  return (
    <AuthLayout
      title="Welcome to KLS Enterprise"
      subtitle="Streamlining Inventory Management with Efficiency"
      imageSrc="/assets/warehouse.jpg"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Get Started
          </h2>
          <p className="text-gray-600 text-center max-w-sm mx-auto">
            Manage your inventory efficiently with our comprehensive system
          </p>
          
          <div className="space-y-4">
            <Link
              to="/login"
              className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-150 hover:shadow-lg transform hover:scale-[1.02]"
            >
              Login to Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              to="/signup"
              className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border-2 border-transparent hover:border-indigo-600 transition-all duration-150"
            >
              Create New Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              By continuing, you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default Welcome;
