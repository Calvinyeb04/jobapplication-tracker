'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserApplications, type Application } from '@/lib/applications';
import { getInterviewsByApplicationId, updateInterview } from '@/lib/interviews';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaArrowLeft, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { GradientButton } from '@/components/ui/GradientButton';
import Link from 'next/link';

export default function EditInterview() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id as string;
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!user || !interviewId) return;
      
      try {
        setIsLoading(true);
        
        // Load all user applications
        const apps = await getUserApplications(user.id);
        setApplications(apps);
        
        // Find the interview data
        // We need to search through all applications to find the interview
        let foundInterview = null;
        
        for (const app of apps) {
          const interviews = await getInterviewsByApplicationId(app.id);
          foundInterview = interviews.find(interview => interview.id === interviewId);
          
          if (foundInterview) {
            setSelectedApplication(app.id);
            
            // Format date and time
            const date = new Date(foundInterview.scheduled_date);
            setScheduledDate(date.toISOString().split('T')[0]);
            setScheduledTime(date.toISOString().split('T')[1].substring(0, 5));
            
            setLocation(foundInterview.location || '');
            setNotes(foundInterview.notes || '');
            setCompleted(foundInterview.completed);
            break;
          }
        }
        
        if (!foundInterview) {
          setError('Interview not found');
        }
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load interview data');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [user, interviewId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedApplication || !scheduledDate || !scheduledTime) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      // Combine date and time
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      // Update the interview
      await updateInterview(interviewId, {
        application_id: selectedApplication,
        scheduled_date: dateTime.toISOString(),
        location: location || undefined,
        notes: notes || undefined,
        completed
      });
      
      // Redirect back to interviews page
      router.push('/interviews');
      router.refresh();
    } catch (err) {
      console.error('Error updating interview:', err);
      setError('Failed to update interview. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Edit Interview</h1>
        <p className="mb-6">Please sign in to update interviews</p>
        <Link href="/auth/signin">
          <GradientButton>Sign In</GradientButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link href="/interviews" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Interviews
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FaCalendarAlt className="mr-3 text-blue-500" /> Edit Interview
        </h1>
      </motion.div>
      
      <AnimatedCard>
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="py-10 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading interview data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Application *
                  </label>
                  <select
                    value={selectedApplication}
                    onChange={(e) => setSelectedApplication(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select a job application</option>
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.company} - {app.role}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="text-gray-400" />
                      </div>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Video call, Company office, etc."
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Add any preparation notes or details about the interview..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="completed" className="ml-2 text-sm text-gray-700">
                    Mark as completed
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Link href="/interviews">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                  </Link>
                  
                  <GradientButton
                    type="submit"
                    disabled={isLoading || isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Update Interview'}
                  </GradientButton>
                </div>
              </div>
            </form>
          )}
        </div>
      </AnimatedCard>
    </div>
  );
} 