// ============================================
// LoadingSpinner.jsx
// ============================================
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'กำลังโหลด...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-amber-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-700 font-semibold mt-4 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;