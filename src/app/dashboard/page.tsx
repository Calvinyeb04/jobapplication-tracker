'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserApplications, Application } from '@/lib/applications';
import { getUserInterviews } from '@/lib/interviews';
import { getTodayChallenge, getWeekChallenges, DailyChallenge } from '@/lib/dailyChallenges';
import { format, isToday, startOfDay, endOfDay, subDays, isWithinInterval } from 'date-fns';
import { motion } from 'framer-motion';
import { FaChartLine, FaCalendarCheck, FaTrophy, FaFire, FaChartBar, FaRegClock } from 'react-icons/fa';

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
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<InterviewWithApplication[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);
  const [weekChallenges, setWeekChallenges] = useState<DailyChallenge[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalInterviews: 0,
    totalOffers: 0,
    rejections: 0,
    todayApplications: 0,
    weeklyApplications: 0,
    dailyGoalMet: false,
    dailyGoalProgress: 0
  });

  const DAILY_GOAL = 5;

  useEffect(() => {
    // Only redirect if we're not in the loading state and we know the user is not authenticated
    if (!isLoading && !user) {
      router.replace('/auth/signin');
      return;
    }

    if (user) {
      const fetchData = async () => {
        try {
          setIsAppLoading(true);
          const [appsData, interviewsData] = await Promise.all([
            getUserApplications(user.id),
            getUserInterviews(user.id)
          ]);

          setAllApplications(appsData);
          setApplications(appsData.slice(0, 5)); // Show 5 most recent

          // Filter upcoming interviews
          const now = new Date();
          const upcomingInterviews = interviewsData
            .filter(interview => new Date(interview.scheduled_date) > now)
            .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
            .slice(0, 3); // Show 3 upcoming interviews

          setInterviews(upcomingInterviews as InterviewWithApplication[]);

          // Get daily challenge data
          try {
            const [todayChallengeData, weekChallengesData] = await Promise.all([
              getTodayChallenge(user.id),
              getWeekChallenges(user.id)
            ]);

            setTodayChallenge(todayChallengeData);
            setWeekChallenges(weekChallengesData);

            // Calculate weekly applications from challenges if available
            const weeklyAppsCount = weekChallengesData.reduce((total, challenge) => 
              total + challenge.applications_count, 0
            );

            // Calculate statistics
            const today = new Date();
            const todayStart = startOfDay(today);
            const todayEnd = endOfDay(today);
            const weekAgo = subDays(today, 7);

            // Fallback to date_applied filtering if no challenge data
            const todayAppsCount = todayChallengeData ? 
              todayChallengeData.applications_count : 
              appsData.filter(app => isWithinInterval(new Date(app.date_applied), { start: todayStart, end: todayEnd })).length;

            const weeklyAppsFromDate = weeklyAppsCount > 0 ? 
              weeklyAppsCount : 
              appsData.filter(app => new Date(app.date_applied) >= weekAgo).length;

            setStats({
              totalApplications: appsData.length,
              totalInterviews: interviewsData.length,
              totalOffers: appsData.filter(app => app.status === 'Offer').length,
              rejections: appsData.filter(app => app.status === 'Rejected').length,
              todayApplications: todayAppsCount,
              weeklyApplications: weeklyAppsFromDate,
              dailyGoalMet: todayChallengeData ? todayChallengeData.goal_met : todayAppsCount >= DAILY_GOAL,
              dailyGoalProgress: Math.min((todayChallengeData ? todayChallengeData.applications_count : todayAppsCount) / DAILY_GOAL, 1)
            });

          } catch (challengeError) {
            console.error('Error fetching challenge data:', challengeError);
            // If challenge data fetch fails, fall back to date-based calculation
            const today = new Date();
            const todayStart = startOfDay(today);
            const todayEnd = endOfDay(today);
            const weekAgo = subDays(today, 7);

            const todayApps = appsData.filter(app => 
              isWithinInterval(new Date(app.date_applied), { start: todayStart, end: todayEnd })
            );

            const weeklyApps = appsData.filter(app => 
              new Date(app.date_applied) >= weekAgo
            );

            setStats({
              totalApplications: appsData.length,
              totalInterviews: interviewsData.length,
              totalOffers: appsData.filter(app => app.status === 'Offer').length,
              rejections: appsData.filter(app => app.status === 'Rejected').length,
              todayApplications: todayApps.length,
              weeklyApplications: weeklyApps.length,
              dailyGoalMet: todayApps.length >= DAILY_GOAL,
              dailyGoalProgress: Math.min(todayApps.length / DAILY_GOAL, 1)
            });
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsAppLoading(false);
        }
      };

      fetchData();
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">Redirecting to login...</div>;
  }

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name || "there"}!</h1>
        <p className="text-gray-600">Here's your job search summary</p>
      </motion.header>

      {/* Activity Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <FaChartLine className="text-indigo-600 mr-2" size={20} />
          <h2 className="text-xl font-semibold text-gray-900">Activity Summary</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FaChartBar className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInterviews}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <FaCalendarCheck className="text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Offers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <FaTrophy className="text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.weeklyApplications}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <FaRegClock className="text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Daily Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center mb-4">
          <FaFire className="text-orange-500 mr-2" size={20} />
          <h2 className="text-xl font-semibold text-gray-900">Daily Challenge</h2>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-gray-700">Apply to 5 jobs today</p>
            <p className="font-medium">{stats.todayApplications} / 5</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.dailyGoalProgress * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2.5 rounded-full ${stats.dailyGoalMet ? 'bg-green-600' : 'bg-blue-600'}`}
            ></motion.div>
          </div>
        </div>

        {stats.dailyGoalMet ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-green-50 p-4 rounded-lg border border-green-200"
          >
            <FaTrophy className="text-yellow-500 text-2xl mx-auto mb-2" />
            <p className="text-green-800 font-medium">Daily goal achieved! Great job!</p>
          </motion.div>
        ) : (
          <Link href="/applications/new">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Apply to a New Job
            </motion.button>
          </Link>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-lg bg-white p-6 shadow"
        >
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
            <div className="text-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"
              ></motion.div>
              <p className="mt-2">Loading applications...</p>
            </div>
          ) : applications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {applications.map((app, index) => (
                <motion.li
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  className="py-3"
                >
                  <Link href={`/applications/${app.id}`} className="block hover:bg-gray-50 rounded-md p-2 transition-colors">
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
                </motion.li>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-lg bg-white p-6 shadow"
        >
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
            <div className="text-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"
              ></motion.div>
              <p className="mt-2">Loading interviews...</p>
            </div>
          ) : interviews.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {interviews.map((interview, index) => (
                <motion.li
                  key={interview.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  className="py-3"
                >
                  <div className="hover:bg-gray-50 rounded-md p-2 transition-colors">
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
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No upcoming interviews.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}