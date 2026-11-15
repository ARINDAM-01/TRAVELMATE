import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-electric-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25',
  gradient: 'bg-gradient-to-r from-electric-blue to-electric-cyan text-white shadow-lg shadow-blue-500/25',
  secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/10',
  outline: 'bg-transparent border border-white/20 text-white hover:bg-white/10',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20',
  ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/5',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl font-semibold',
  xl: 'px-8 py-4 text-lg rounded-2xl font-bold',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  icon: Icon,
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
