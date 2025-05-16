'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export function GradientButton({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  variant = 'primary'
}: GradientButtonProps) {
  
  // Define gradient styles based on variant
  const getGradientClasses = () => {
    switch (variant) {
      case 'primary':
        return 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700';
      case 'secondary':
        return 'from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700';
      case 'success':
        return 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700';
      case 'warning':
        return 'from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700';
      default:
        return 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700';
    }
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 rounded-lg font-medium text-white
        bg-gradient-to-r ${getGradientClasses()}
        transition-all duration-200 ease-in-out
        shadow-md hover:shadow-lg
        transform hover:-translate-y-1
        disabled:opacity-50 disabled:pointer-events-none
        overflow-hidden
        ${className}
      `}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Animated glow effect */}
      <motion.span
        className="absolute inset-0 bg-white opacity-0"
        animate={{
          opacity: [0, 0.1, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Button text */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </motion.button>
  );
} 