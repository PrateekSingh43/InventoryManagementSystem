import React from 'react';

const AddProductModal = ({ onClose, onAddProduct }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Add Product to Rate Chart</h2>
        {/* Add form elements for product details here */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddProductModal;
