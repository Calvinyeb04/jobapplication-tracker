'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserInterviews, updateInterview } from '@/lib/interviews';
import { format } from 'date-fns';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaCheckCircle, FaPen, FaPlus, FaBuilding, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { FloatingIcons } from '@/components/ui/FloatingIcons';

interface InterviewWithApplication {
  id: string;
  application_id: string;
  scheduled_date: string;
  location: string | null;
  notes: string | null;
  completed: boolean;
  created_at: string;
  applications: {
    id: string;
    company: string;
    role: string;
    user_id: string;
  };
}

export default function Interviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<InterviewWithApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingInterviews, setUpcomingInterviews] = useState<InterviewWithApplication[]>([]);
  const [pastInterviews, setPastInterviews] = useState<InterviewWithApplication[]>([]);

  useEffect(() => {
    async function fetchInterviews() {
      if (user) {
        try {
          setIsLoading(true);
          const data = await getUserInterviews(user.id);
          setInterviews(data as InterviewWithApplication[]);
          
          // Split interviews into upcoming and past
          const now = new Date();
          const upcoming: InterviewWithApplication[] = [];
          const past: InterviewWithApplication[] = [];
          
          data.forEach((interview: InterviewWithApplication) => {
            const interviewDate = new Date(interview.scheduled_date);
            if (interviewDate > now && !interview.completed) {
              upcoming.push(interview);
            } else {
              past.push(interview);
            }
          });
          
          // Sort upcoming interviews by date (closest first)
          upcoming.sort((a, b) => 
            new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
          );
          
          // Sort past interviews by date (most recent first)
          past.sort((a, b) => 
            new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
          );
          
          setUpcomingInterviews(upcoming);
          setPastInterviews(past);
        } catch (error) {
          console.error('Error fetching interviews:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchInterviews();
  }, [user]);

  async function markAsCompleted(interviewId: string) {
    try {
      await updateInterview(interviewId, { completed: true });
      
      // Update local state
      const updatedInterviews = interviews.map(interview => 
        interview.id === interviewId 
          ? { ...interview, completed: true } 
          : interview
      );
      
      setInterviews(updatedInterviews);
      
      // Recategorize interviews
      const now = new Date();
      const upcoming = updatedInterviews.filter(
        interview => new Date(interview.scheduled_date) > now && !interview.completed
      );
      const past = updatedInterviews.filter(
        interview => new Date(interview.scheduled_date) <= now || interview.completed
      );
      
      // Sort upcoming interviews by date (closest first)
      upcoming.sort((a, b) => 
        new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
      );
      
      // Sort past interviews by date (most recent first)
      past.sort((a, b) => 
        new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
      );
      
      setUpcomingInterviews(upcoming);
      setPastInterviews(past);
    } catch (error) {
      console.error('Error marking interview as completed:', error);
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <motion.h1 
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Interview Tracker
        </motion.h1>
        <motion.p 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Please sign in to view your interviews
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/auth/signin">
            <GradientButton>
              Sign In
            </GradientButton>
          </Link>
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
      <FloatingIcons variant="interviews" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your Interviews
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Manage and prepare for your upcoming interviews
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/interviews/new">
            <GradientButton>
              <FaPlus className="mr-2" /> Schedule New Interview
            </GradientButton>
          </Link>
        </motion.div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
            }}
            className="text-5xl text-blue-500"
          >
            <FaCalendarAlt />
          </motion.div>
        </div>
      ) : interviews.length > 0 ? (
        <div className="space-y-8">
          {/* Upcoming interviews section */}
          <div>
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FaCalendarAlt className="mr-2 text-blue-500" /> Upcoming Interviews
            </motion.h2>
            
            {upcomingInterviews.length > 0 ? (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {upcomingInterviews.map((interview, index) => (
                  <motion.div key={interview.id} variants={item}>
                    <AnimatedCard delay={index * 0.1}>
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-500">
                              <FaBuilding className="text-xl" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {interview.applications.company}
                              </h3>
                              <p className="text-gray-600">{interview.applications.role}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                            <div className="flex items-center space-x-2 text-indigo-700">
                              <FaCalendarAlt />
                              <span className="font-medium">
                                {format(new Date(interview.scheduled_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600 mt-1">
                              <FaClock />
                              <span>
                                {format(new Date(interview.scheduled_date), 'h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {interview.location && (
                          <div className="flex items-start space-x-2 mb-4 text-gray-600">
                            <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                            <p>{interview.location}</p>
                          </div>
                        )}
                        
                        {interview.notes && (
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                            <p className="text-gray-700">{interview.notes}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-3">
                          <Link href={`/interviews/${interview.id}/edit`}>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              <FaPen className="mr-2" /> Edit
                            </motion.button>
                          </Link>
                          
                          <GradientButton 
                            variant="success"
                            onClick={() => markAsCompleted(interview.id)}
                          >
                            <FaCheckCircle className="mr-2" /> Mark as Completed
                          </GradientButton>
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <AnimatedCard className="p-6 text-center">
                <p className="text-gray-600">No upcoming interviews scheduled</p>
              </AnimatedCard>
            )}
          </div>
          
          {/* Past interviews section */}
          {pastInterviews.length > 0 && (
            <div>
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <FaCheckCircle className="mr-2 text-green-500" /> Past Interviews
              </motion.h2>
              
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {pastInterviews.map((interview, index) => (
                  <motion.div key={interview.id} variants={item}>
                    <AnimatedCard delay={(index + upcomingInterviews.length) * 0.1} className="opacity-80 hover:opacity-100">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="bg-gray-100 p-3 rounded-full text-gray-500">
                              <FaBuilding className="text-xl" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                {interview.applications.company}
                              </h3>
                              <p className="text-gray-600">{interview.applications.role}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex items-center space-x-3">
                            <div className="flex flex-col items-start md:items-end">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FaCalendarAlt />
                                <span>
                                  {format(new Date(interview.scheduled_date), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                            
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Completed
                            </span>
                          </div>
                        </div>
                        
                        {interview.notes && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-700 text-sm">{interview.notes}</p>
                          </div>
                        )}
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      ) : (
        <AnimatedCard className="p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="text-5xl text-blue-500 mx-auto mb-6"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <FaCalendarAlt />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">No interviews scheduled</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Schedule interviews for your job applications to keep track of them and improve your preparation.
            </p>
            <Link href="/interviews/new">
              <GradientButton variant="primary">
                <FaPlus className="mr-2" /> Schedule your first interview
              </GradientButton>
            </Link>
          </motion.div>
        </AnimatedCard>
      )}
    </div>
  );
} 