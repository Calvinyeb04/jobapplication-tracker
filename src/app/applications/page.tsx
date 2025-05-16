'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserApplications, Application } from '@/lib/applications';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaBriefcase, FaPlus, FaSearch } from 'react-icons/fa';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { FloatingIcons } from '@/components/ui/FloatingIcons';

export default function ApplicationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [isLoading, user, router]);
  
  useEffect(() => {
    if (user) {
      const fetchApplications = async () => {
        try {
          setIsAppLoading(true);
          const data = await getUserApplications(user.id);
          setApplications(data);
          setFilteredApplications(data);
        } catch (error) {
          console.error('Error fetching applications:', error);
        } finally {
          setIsAppLoading(false);
        }
      };
      
      fetchApplications();
    }
  }, [user]);
  
  // Filter applications based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredApplications(applications);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = applications.filter(app => 
        app.company.toLowerCase().includes(query) || 
        app.role.toLowerCase().includes(query) ||
        (app.notes && app.notes.toLowerCase().includes(query))
      );
      setFilteredApplications(filtered);
    }
  }, [searchQuery, applications]);
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 0, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="text-blue-500 text-5xl"
        >
          <FaBriefcase />
        </motion.div>
      </div>
    );
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="relative min-h-screen">
      {/* Floating background icons */}
      <FloatingIcons variant="applications" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
      >
        <div>
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            My Applications
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Track and manage your job application progress
          </motion.p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-60"
            />
          </motion.div>
          
          {/* Add new application button */}
          <Link href="/applications/new">
            <GradientButton className="whitespace-nowrap">
              <FaPlus className="mr-2" /> Add Application
            </GradientButton>
          </Link>
        </div>
      </motion.div>
      
      {isAppLoading ? (
        <div className="h-64 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 0, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="text-blue-500 text-5xl"
          >
            <FaBriefcase />
          </motion.div>
        </div>
      ) : filteredApplications.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredApplications.map((app, index) => (
            <motion.div key={app.id} variants={item}>
              <AnimatedCard delay={index * 0.1} className="h-full">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{app.company}</h2>
                      <p className="text-lg text-gray-700">{app.role}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      app.status === 'Applied' ? 'bg-blue-100 text-blue-800' : 
                      app.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' : 
                      app.status === 'Offer' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Applied on {format(new Date(app.date_applied), 'MMM d, yyyy')}
                    </p>
                    {app.job_link && (
                      <a 
                        href={app.job_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700 flex items-center mt-1"
                      >
                        <FaSearch className="mr-1 text-xs" /> View job listing
                      </a>
                    )}
                  </div>
                  
                  {app.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{app.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 mt-2">
                    <Link href={`/applications/${app.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 focus:outline-none"
                      >
                        View
                      </motion.button>
                    </Link>
                    <Link href={`/applications/${app.id}/edit`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-sm font-medium text-indigo-700 hover:text-indigo-800 focus:outline-none"
                      >
                        Edit
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <AnimatedCard className="p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="text-5xl text-blue-500 mx-auto mb-6"
            >
              <FaBriefcase />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">No applications yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start tracking your job applications to keep your job search organized and increase your chances of landing your dream job.
            </p>
            <Link href="/applications/new">
              <GradientButton variant="primary">
                <FaPlus className="mr-2" /> Add Your First Application
              </GradientButton>
            </Link>
          </motion.div>
        </AnimatedCard>
      )}
    </div>
  );
} 