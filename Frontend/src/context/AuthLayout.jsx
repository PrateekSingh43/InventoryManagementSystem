import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, imageSrc, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-600 text-white">
        <div className="absolute inset-0">
          <img 
            src={imageSrc || '/assets/warehouse.jpg'} 
            alt="Inventory Management" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="/assets/logo.png" 
              alt="KLS Enterprise" 
              className="w-32 mb-8"
            />
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-xl opacity-90">{subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Forms */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
