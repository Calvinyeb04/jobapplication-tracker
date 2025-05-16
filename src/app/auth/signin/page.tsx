'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SignInForm from '@/components/auth/SignInForm';
import { useAuth } from '@/context/AuthContext';

export default function SignIn() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);
  
  const handleSuccess = (userId: string) => {
    login(userId);
    router.push('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <Link href="/" className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-xl">JT</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  JobTracker
                </span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to continue your job search journey</p>
            </div>
            
            <SignInForm onSuccess={handleSuccess} />
            
            <div className="mt-8 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right side - Image/Illustration */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 relative">
          <div className="animate-float absolute top-10 right-10 w-64 h-48 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-4 transform rotate-3">
            <div className="h-5 w-24 bg-white/30 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/20 rounded"></div>
              <div className="h-3 w-5/6 bg-white/20 rounded"></div>
              <div className="h-3 w-4/6 bg-white/20 rounded"></div>
            </div>
            <div className="absolute bottom-4 right-4 h-6 w-20 bg-green-400/30 rounded-full"></div>
          </div>
          
          <div className="animate-float animation-delay-300 absolute top-44 left-10 w-72 h-56 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-4 transform -rotate-2">
            <div className="h-5 w-32 bg-white/30 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/20 rounded"></div>
              <div className="h-3 w-5/6 bg-white/20 rounded"></div>
              <div className="h-3 w-4/6 bg-white/20 rounded"></div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-yellow-400/30"></div>
              <div className="h-3 w-20 bg-white/30 rounded"></div>
            </div>
          </div>
          
          <div className="animate-float animation-delay-600 absolute bottom-20 right-12 w-64 h-52 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-4 transform rotate-6">
            <div className="h-5 w-28 bg-white/30 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/20 rounded"></div>
              <div className="h-3 w-5/6 bg-white/20 rounded"></div>
              <div className="h-3 w-4/6 bg-white/20 rounded"></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-6 w-full bg-blue-400/30 rounded"></div>
              <div className="h-6 w-full bg-green-400/30 rounded"></div>
              <div className="h-6 w-full bg-red-400/30 rounded"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Track Your Career Path</h2>
              <p className="text-blue-100 max-w-xs mx-auto">
                Organize applications, manage interviews, and land your dream job with JobTracker
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 