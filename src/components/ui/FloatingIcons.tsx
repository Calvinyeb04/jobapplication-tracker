'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { FaBriefcase, FaCalendarAlt, FaFileAlt, FaSearch, FaCheckCircle, FaLaptopCode, FaEnvelope } from 'react-icons/fa';

interface FloatingIconsProps {
  variant?: 'applications' | 'interviews' | 'recommendations' | 'cover-letter';
}

export function FloatingIcons({ variant = 'applications' }: FloatingIconsProps) {
  // Different icon sets for different pages
  const getIcons = () => {
    switch (variant) {
      case 'applications':
        return [
          { Icon: FaBriefcase, color: 'text-blue-500', x: '10%', y: '20%', size: 'text-4xl' },
          { Icon: FaFileAlt, color: 'text-indigo-500', x: '80%', y: '15%', size: 'text-3xl' },
          { Icon: FaCheckCircle, color: 'text-green-500', x: '20%', y: '85%', size: 'text-4xl' },
          { Icon: FaSearch, color: 'text-purple-500', x: '90%', y: '70%', size: 'text-3xl' }
        ];
      case 'interviews':
        return [
          { Icon: FaCalendarAlt, color: 'text-orange-500', x: '15%', y: '15%', size: 'text-4xl' },
          { Icon: FaBriefcase, color: 'text-blue-500', x: '70%', y: '20%', size: 'text-3xl' },
          { Icon: FaCheckCircle, color: 'text-green-500', x: '85%', y: '75%', size: 'text-3xl' },
          { Icon: FaLaptopCode, color: 'text-indigo-500', x: '25%', y: '85%', size: 'text-4xl' }
        ];
      case 'recommendations':
        return [
          { Icon: FaSearch, color: 'text-blue-500', x: '10%', y: '25%', size: 'text-4xl' },
          { Icon: FaLaptopCode, color: 'text-teal-500', x: '75%', y: '15%', size: 'text-3xl' },
          { Icon: FaBriefcase, color: 'text-purple-500', x: '15%', y: '80%', size: 'text-3xl' },
          { Icon: FaCheckCircle, color: 'text-green-500', x: '85%', y: '70%', size: 'text-4xl' }
        ];
      case 'cover-letter':
        return [
          { Icon: FaFileAlt, color: 'text-indigo-500', x: '15%', y: '20%', size: 'text-4xl' },
          { Icon: FaEnvelope, color: 'text-blue-500', x: '80%', y: '15%', size: 'text-3xl' },
          { Icon: FaCheckCircle, color: 'text-green-500', x: '20%', y: '75%', size: 'text-3xl' },
          { Icon: FaLaptopCode, color: 'text-purple-500', x: '85%', y: '85%', size: 'text-4xl' }
        ];
      default:
        return [];
    }
  };

  const icons = getIcons();

  const generateRandomDuration = () => {
    return 10 + Math.random() * 10; // Between 10-20 seconds
  };

  const generateRandomDelay = () => {
    return Math.random() * 5; // Between 0-5 seconds
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className={`absolute ${icon.size} ${icon.color} opacity-20`}
          style={{
            left: icon.x,
            top: icon.y,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: generateRandomDuration(),
            ease: "easeInOut",
            repeat: Infinity,
            delay: generateRandomDelay(),
          }}
        >
          <icon.Icon />
        </motion.div>
      ))}
    </div>
  );
} 