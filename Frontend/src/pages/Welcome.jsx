import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Welcome to KLS Enterprises
        </h1>
        
        <p className="text-xl text-gray-600 mt-4">
          Inventory Management System
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
