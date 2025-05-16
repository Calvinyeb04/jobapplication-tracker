'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaRocket } from 'react-icons/fa';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  slogan?: boolean;
}

export default function Logo({ size = 'md', showText = true, slogan = false }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [randomStars, setRandomStars] = useState<{ x: number; y: number; delay: number; size: number }[]>([]);

  // Generate random stars positions for the logo background
  useEffect(() => {
    const stars = Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 2 + 1,
    }));
    setRandomStars(stars);
  }, []);

  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-16 h-16 text-3xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/">
      <motion.div 
        className="flex items-center"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center mr-2`}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Star background */}
          <div className="absolute inset-0 w-full h-full">
            {randomStars.map((star, index) => (
              <motion.div
                key={index}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Rocket icon */}
          <motion.div
            animate={isHovered ? {
              y: [-2, -5, -2],
              rotate: [0, 5, 0],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            className="relative z-10"
          >
            <FaRocket className="text-white" />
          </motion.div>
        </motion.div>

        {showText && (
          <div className="flex flex-col">
            <motion.span 
              className={`font-bold ${textSizes[size]} bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400 bg-clip-text text-transparent`}
              whileHover={{ scale: 1.02 }}
            >
              Astro Tracker
            </motion.span>
            
            {slogan && (
              <motion.span 
                className="text-xs text-gray-500"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Track. Apply. Succeed.
              </motion.span>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
} 