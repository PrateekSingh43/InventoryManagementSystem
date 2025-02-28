import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react'; // Add icon

const RateChartCard = () => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/ratechart')}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow flex items-center space-x-3 w-64"
    >
      <ClipboardList className="h-5 w-5 text-indigo-500" />
      <div>
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Rate Chart</h2>
        <p className="text-xs text-gray-500">View today's rates</p>
      </div>
    </div>
  );
};

export default RateChartCard;
