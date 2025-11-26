import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyle = 'font-semibold transition-all duration-300 ease-in-out';
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variants = {
    primary: 'border-2 border-gold bg-cream text-gold hover:bg-gold hover:text-cream',
    filled: 'bg-gold text-cream hover:bg-darkGold',
    secondary: 'border-2 border-lightText bg-cream text-lightText hover:bg-lightText hover:text-cream',
  };

  return (
    <button
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ 
  label,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gold mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border-2 border-gold bg-white text-lightText transition-all duration-200 focus:outline-none focus:border-darkGold focus:shadow-lg ${className} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export const Card = ({ 
  children, 
  className = '',
  hoverable = true,
}) => {
  return (
    <div
      className={`bg-white p-6 border-2 border-gold transition-all duration-300 ${
        hoverable ? 'hover:shadow-lg hover:border-darkGold' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const Badge = ({ 
  children, 
  variant = 'default',
  className = '',
}) => {
  const variants = {
    default: 'bg-gold text-cream',
    secondary: 'bg-cream text-gold border-2 border-gold',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
  };

  return (
    <span className={`inline-block px-3 py-1 text-sm font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
