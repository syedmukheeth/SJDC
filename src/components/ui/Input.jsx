import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</label>}
      <input
        className={`w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl outline-none focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/5 transition-all font-bold text-gray-700 placeholder:text-gray-300 ${
          error ? 'border-red-500 bg-red-50' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1 font-bold">{error}</p>}
    </div>
  );
};
