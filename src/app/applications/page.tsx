'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserApplications, deleteAllApplications, Application, SortKey, SortOrder } from '@/lib/applications';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaBriefcase, FaPlus, FaSearch, FaTrash, FaFilter, FaSort } from 'react-icons/fa';
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
  const [sortKey, setSortKey] = useState<SortKey>('date_applied');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Fall', 'Spring', 'Summer', 'Winter', 'General'];

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
          const data = await getUserApplications(user.id, sortKey, sortOrder);
          setApplications(data);
        } catch (error) {
          console.error('Error fetching applications:', error);
        } finally {
          setIsAppLoading(false);
        }
      };
      fetchApplications();
    }
  }, [user, sortKey, sortOrder]);

  useEffect(() => {
    let filtered = [...applications];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.company.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query) ||
        (app.notes && app.notes.toLowerCase().includes(query))
      );
    }

    setFilteredApplications(filtered);
  }, [searchQuery, applications, selectedCategory]);

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all your applications? This action cannot be undone.')) {
      try {
        if (user) {
          await deleteAllApplications(user.id);
          setApplications([]);
        }
      } catch (error) {
        console.error('Error deleting all applications:', error);
        alert('Failed to delete all applications. Please try again.');
      }
    }
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 0, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }} className="text-blue-500 text-5xl">
          <FaBriefcase />
        </motion.div>
      </div>
    );
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="relative min-h-screen">
      <FloatingIcons variant="applications" />
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div>
            <motion.h1 className="text-3xl font-bold text-gray-900 mb-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>My Applications</motion.h1>
            <motion.p className="text-gray-600" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>Track and manage your job application progress</motion.p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/applications/new"><GradientButton className="whitespace-nowrap"><FaPlus className="mr-2" /> Add Application</GradientButton></Link>
            <GradientButton onClick={handleClearAll} className="whitespace-nowrap bg-red-500 hover:bg-red-600"><FaTrash className="mr-2" /> Clear All</GradientButton>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaSearch className="text-gray-400" /></div>
            <input type="text" placeholder="Search applications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaFilter className="text-gray-400" /></div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto appearance-none">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaSort className="text-gray-400" /></div>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto appearance-none">
              <option value="date_applied">Sort by Date</option>
              <option value="company">Sort by Company</option>
              <option value="role">Sort by Role</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
          <div className="relative">
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto appearance-none">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </motion.div>

      {isAppLoading ? (
        <div className="h-64 flex items-center justify-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }} className="text-blue-500 text-5xl"><FaBriefcase /></motion.div>
        </div>
      ) : filteredApplications.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredApplications.map((app, index) => (
            <motion.div key={app.id} variants={item}>
              <AnimatedCard delay={index * 0.1} className="h-full">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{app.company}</h2>
                      <p className="text-lg text-gray-700">{app.role}</p>
                      {app.category && <p className="text-sm text-gray-500">Category: {app.category}</p>}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${app.status === 'Applied' ? 'bg-blue-100 text-blue-800' : app.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' : app.status === 'Offer' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{app.status}</span>
                  </div>
                  <div className="mb-4"><p className="text-sm text-gray-500">Applied on: {format(new Date(app.date_applied), 'MMMM d, yyyy')}</p></div>
                  {app.notes && <div className="mb-4 p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-600">{app.notes}</p></div>}
                  <div className="flex justify-end">
                    <Link href={`/applications/${app.id}`}><span className="text-blue-600 hover:underline">View Details</span></Link>
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