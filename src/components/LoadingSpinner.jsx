// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = "กำลังโหลด..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-amber-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;