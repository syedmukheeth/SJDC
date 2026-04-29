import React from 'react';

const variants = {
  primary: 'bg-primary text-white hover:opacity-90',
  secondary: 'bg-secondary text-primary hover:opacity-90',
  outline: 'border border-primary text-primary hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-gray-600 hover:bg-gray-100',
};

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
