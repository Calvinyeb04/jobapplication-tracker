'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ApplicationForm from '@/components/applications/ApplicationForm';
import { useEffect } from 'react';

export default function NewApplication() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [isLoading, user, router]);
  
  const handleSuccess = () => {
    router.push('/applications');
  };
  
  const handleCancel = () => {
    router.push('/applications');
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Add New Application</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <ApplicationForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </div>
  );
} 