import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const RateChartCard = () => {
  const { products = [] } = useAppContext();
  const navigate = useNavigate();
  const previewProducts = products.slice(0, 3);

  return (
    <div 
      onClick={() => navigate('/rate-chart')}
      className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today's Rates</h3>
        <TrendingUp className="h-6 w-6 text-indigo-600" />
      </div>
      <div className="space-y-3">
        {previewProducts.map((product) => (
          <div key={product.id} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {product.name} ({product.weight}kg)
            </span>
            <span className="text-sm font-medium text-gray-900">
              ₹{product.currentPrice}/quintal
            </span>
          </div>
        ))}
      </div>
      {products.length > 3 && (
        <div className="mt-4 pt-3 border-t">
          <p className="text-sm text-center text-gray-500">
            View full rate chart
          </p>
        </div>
      )}
    </div>
  );
};

export default RateChartCard;
