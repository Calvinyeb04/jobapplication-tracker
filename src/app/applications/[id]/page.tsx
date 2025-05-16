'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getApplicationById, Application, deleteApplication } from '@/lib/applications';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBriefcase, FaCalendarAlt, FaEdit, FaExternalLinkAlt, FaTag, FaTrash, FaUser, FaEnvelope, FaPhone, FaIdBadge, FaUserFriends } from 'react-icons/fa';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { GradientButton } from '@/components/ui/GradientButton';

export default function ApplicationDetailPage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
  
    const [application, setApplication] = useState<Application | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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
  
    const handleDelete = async () => {
        try {
            await deleteApplication(id);
            router.push('/applications');
        } catch (err) {
            setError('Failed to delete application');
            console.error(err);
        }
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
                    <GradientButton>
                        <FaArrowLeft className="mr-2" /> Back to Applications
                    </GradientButton>
                </Link>
            </div>
        );
    }
  
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Link href="/applications">
                    <motion.button
                        whileHover={{ x: -5 }}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Applications
                    </motion.button>
                </Link>
                
                <div className="flex space-x-3">
                    <Link href={`/applications/${id}/edit`}>
                        <GradientButton variant="secondary">
                            <FaEdit className="mr-2" /> Edit
                        </GradientButton>
                    </Link>
                    
                    <GradientButton 
                        variant="warning" 
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <FaTrash className="mr-2" /> Delete
                    </GradientButton>
                </div>
            </div>
            
            <AnimatedCard>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{application.role}</h1>
                            <h2 className="text-xl text-gray-700">{application.company}</h2>
                        </div>
                        
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                            application.status === 'Applied' ? 'bg-blue-100 text-blue-800' : 
                            application.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' : 
                            application.status === 'Offer' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'
                        }`}>
                            {application.status}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-start">
                            <FaCalendarAlt className="mt-1 text-blue-500 mr-3" />
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date Applied</h3>
                                <p className="mt-1">{format(new Date(application.date_applied), 'MMMM d, yyyy')}</p>
                            </div>
                        </div>
                        
                        {application.job_link && (
                            <div className="flex items-start">
                                <FaExternalLinkAlt className="mt-1 text-blue-500 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Job Listing</h3>
                                    <a 
                                        href={application.job_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                    >
                                        View job listing <FaExternalLinkAlt className="ml-1 text-xs" />
                                    </a>
                                </div>
                            </div>
                        )}
                        
                        {application.tags && application.tags.length > 0 && (
                            <div className="flex items-start">
                                <FaTag className="mt-1 text-blue-500 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {application.tags.map((tag, index) => (
                                            <span 
                                                key={index}
                                                className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Hiring Manager Information */}
                    {(application.hiring_manager_name || application.hiring_manager_email || 
                        application.hiring_manager_phone || application.hiring_manager_title) && (
                        <div className="border-t border-gray-200 pt-6 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Hiring Manager Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {application.hiring_manager_name && (
                                    <div className="flex items-start">
                                        <FaUser className="mt-1 text-blue-500 mr-3" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                            <p className="mt-1">{application.hiring_manager_name}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {application.hiring_manager_title && (
                                    <div className="flex items-start">
                                        <FaIdBadge className="mt-1 text-blue-500 mr-3" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Title</h3>
                                            <p className="mt-1">{application.hiring_manager_title}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {application.hiring_manager_email && (
                                    <div className="flex items-start">
                                        <FaEnvelope className="mt-1 text-blue-500 mr-3" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                            <a 
                                                href={`mailto:${application.hiring_manager_email}`}
                                                className="mt-1 text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {application.hiring_manager_email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                
                                {application.hiring_manager_phone && (
                                    <div className="flex items-start">
                                        <FaPhone className="mt-1 text-blue-500 mr-3" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                            <a 
                                                href={`tel:${application.hiring_manager_phone}`}
                                                className="mt-1 text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {application.hiring_manager_phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Connections */}
                    {application.connections && application.connections.length > 0 && (
                        <div className="border-t border-gray-200 pt-6 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <FaUserFriends className="mr-2 text-blue-500" /> Company Connections
                            </h3>
                            <ul className="list-disc pl-8 space-y-2">
                                {application.connections.map((connection, index) => (
                                    <li key={index}>{connection}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* Notes */}
                    {application.notes && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="whitespace-pre-wrap">{application.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </AnimatedCard>
            
            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4"
                    >
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Application</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this application? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <GradientButton 
                                variant="warning"
                                onClick={handleDelete}
                            >
                                Delete
                            </GradientButton>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
} 