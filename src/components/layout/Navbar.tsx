'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserAstronaut, FaCog, FaSignOutAlt, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/applications', label: 'Applications' },
    { href: '/interviews', label: 'Interviews' },
    { href: '/recommendations', label: 'Recommendations' },
    { href: '/cover-letter', label: 'Cover Letter' },
  ];

  const resourceLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/faq', label: 'FAQ' },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`sticky top-0 z-50 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-lg shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm' 
      } transition-all duration-300`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <motion.div 
            className="flex items-center"
            variants={itemVariants}
          >
            <Logo size="md" showText={true} slogan={true} />
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-1 items-center">
            {user && navLinks.map((link, index) => (
              <motion.div key={link.href} variants={itemVariants} custom={index}>
                <Link 
                  href={link.href} 
                  className="relative py-2 px-4 text-sm font-medium transition-colors duration-300 rounded-md hover:bg-indigo-50 group"
                >
                  <span className={`${isActive(link.href) ? 'text-indigo-600' : 'text-gray-600 group-hover:text-indigo-600'}`}>
                    {link.label}
                  </span>
                  
                  {isActive(link.href) && (
                    <motion.span 
                      layoutId="activeTab"
                      className="absolute inset-x-0 -bottom-1 h-0.5 bg-indigo-600"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}

            {/* Resources Dropdown */}
            {user && (
              <motion.div variants={itemVariants} className="relative">
                <button
                  onClick={() => setResourcesMenuOpen(!resourcesMenuOpen)}
                  className="relative py-2 px-4 text-sm font-medium transition-colors duration-300 rounded-md hover:bg-indigo-50 group flex items-center"
                >
                  <span className={`${
                    isActive('/about') || isActive('/faq') 
                      ? 'text-indigo-600' 
                      : 'text-gray-600 group-hover:text-indigo-600'
                  }`}>
                    Resources
                  </span>
                  <FaChevronDown className={`ml-1 h-3 w-3 ${
                    isActive('/about') || isActive('/faq') 
                      ? 'text-indigo-600' 
                      : 'text-gray-600 group-hover:text-indigo-600'
                  }`} />
                  
                  {(isActive('/about') || isActive('/faq')) && (
                    <motion.span 
                      layoutId="activeTab"
                      className="absolute inset-x-0 -bottom-1 h-0.5 bg-indigo-600"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
                
                <AnimatePresence>
                  {resourcesMenuOpen && (
                    <motion.div 
                      className="absolute left-0 mt-2 w-36 rounded-lg shadow-lg py-1 bg-white/90 backdrop-blur-sm border border-indigo-100"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      {resourceLinks.map((link) => (
                        <Link 
                          key={link.href}
                          href={link.href} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                          onClick={() => setResourcesMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            
            {user ? (
              <motion.div variants={itemVariants} className="ml-8 relative">
                <motion.button 
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors duration-300"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div 
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium overflow-hidden"
                    whileHover={{ rotate: 5 }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </motion.div>
                  <span className="font-medium hidden sm:block">{user.name || user.email.split('@')[0]}</span>
                </motion.button>
                
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white/90 backdrop-blur-sm border border-indigo-100"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">
                        <FaUserAstronaut className="mr-2" /> Your Profile
                      </Link>
                      <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">
                        <FaCog className="mr-2" /> Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FaSignOutAlt className="mr-2" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <motion.div variants={itemVariants} className="flex md:hidden">
            <motion.button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence initial={false} mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaTimes className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaBars className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-2 pb-3 space-y-1 px-2">
              {user && navLinks.map((link, i) => (
                <motion.div 
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block py-2 px-4 text-base font-medium rounded-md ${
                      isActive(link.href)
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Resources Section */}
              {user && (
                <div>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    className={`flex items-center justify-between w-full py-2 px-4 text-base font-medium rounded-md ${
                      isActive('/about') || isActive('/faq')
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                    onClick={() => setResourcesMenuOpen(!resourcesMenuOpen)}
                  >
                    <span>Resources</span>
                    <FaChevronDown className={`h-4 w-4 transform ${resourcesMenuOpen ? 'rotate-180' : ''} transition-transform duration-200`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {resourcesMenuOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-6"
                      >
                        {resourceLinks.map((link, i) => (
                          <motion.div 
                            key={link.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Link
                              href={link.href}
                              className={`block py-2 px-4 text-base font-medium rounded-md ${
                                isActive(link.href)
                                  ? 'bg-indigo-50 text-indigo-600'
                                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.name || 'User'}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 px-4">
                  <Link
                    href="/auth/signin"
                    className="block py-2 text-base font-medium text-indigo-600 hover:text-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block mt-2 py-2 px-4 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium text-white text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 