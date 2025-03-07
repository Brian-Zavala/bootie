// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4'
  };
  
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizeClasses[size]} rounded-full border-gray-200 border-t-primary-600 animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;