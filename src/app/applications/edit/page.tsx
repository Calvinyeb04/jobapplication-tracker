'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getApplicationById, Application } from '@/lib/applications';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBriefcase } from 'react-icons/fa';
import ApplicationForm from '@/components/applications/ApplicationForm';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

export default function EditApplicationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
  
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    
    async function fetchApplication() {
      try {
        setIsLoading(true);
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (err) {
        setError('Failed to load application details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchApplication();
  }, [id, user, router]);
  
  const handleSuccess = () => {
    router.push(`/applications/${id}`);
  };
  
  const handleCancel = () => {
    router.push(`/applications/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
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
  
  if (error || !application) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error || 'Application not found'}</p>
        <Link href="/applications">
          <button className="button">
            <FaArrowLeft className="mr-2" /> Back to Applications
          </button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/applications/${id}`}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to Application
          </motion.button>
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Edit Application</h1>
        <p className="text-gray-600">{application.company} - {application.role}</p>
      </div>
      
      <AnimatedCard>
        <div className="p-6">
          <ApplicationForm
            initialData={application}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </AnimatedCard>
    </div>
  );
} 