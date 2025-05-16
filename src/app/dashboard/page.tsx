'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserApplications, Application } from '@/lib/applications';
import { getUserInterviews } from '@/lib/interviews';
import { format } from 'date-fns';

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

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<InterviewWithApplication[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [isLoading, user, router]);
  
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setIsAppLoading(true);
          const [appsData, interviewsData] = await Promise.all([
            getUserApplications(user.id),
            getUserInterviews(user.id)
          ]);
          setApplications(appsData.slice(0, 5)); // Show 5 most recent
          
          // Filter upcoming interviews
          const now = new Date();
          const upcomingInterviews = interviewsData
            .filter(interview => new Date(interview.scheduled_date) > now)
            .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
            .slice(0, 3); // Show 3 upcoming interviews
            
          setInterviews(upcomingInterviews as InterviewWithApplication[]);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsAppLoading(false);
        }
      };
      
      fetchData();
    }
  }, [user]);
  
  if (isLoading || !user) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name || "there"}!</h1>
        <p className="text-gray-600">Here's your job search summary</p>
      </header>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
            <Link 
              href="/applications" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          
          {isAppLoading ? (
            <div className="text-center py-4">Loading applications...</div>
          ) : applications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {applications.map(app => (
                <li key={app.id} className="py-3">
                  <Link href={`/applications/${app.id}`} className="block hover:bg-gray-50">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900">{app.role}</p>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        app.status === 'Applied' ? 'bg-blue-100 text-blue-800' : 
                        app.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' : 
                        app.status === 'Offer' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{app.company}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Applied on {format(new Date(app.date_applied), 'MMM d, yyyy')}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No applications yet.{' '}
              <Link href="/applications/new" className="text-blue-600 hover:text-blue-500">
                Add your first application
              </Link>
            </div>
          )}
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Interviews</h2>
            <Link 
              href="/interviews" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          
          {isAppLoading ? (
            <div className="text-center py-4">Loading interviews...</div>
          ) : interviews.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {interviews.map(interview => (
                <li key={interview.id} className="py-3">
                  <div>
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900">
                        {interview.applications.company}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(interview.scheduled_date), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{interview.applications.role}</p>
                    {interview.location && (
                      <p className="text-xs text-gray-400 mt-1">{interview.location}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No upcoming interviews.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 