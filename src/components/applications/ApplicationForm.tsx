'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { Application, ApplicationInput, createApplication, updateApplication } from '@/lib/applications';

const applicationSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job role is required'),
  job_link: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  date_applied: z.string().min(1, 'Application date is required'),
  status: z.enum(['Applied', 'Interview', 'Offer', 'Rejected']),
  tags: z.string().optional(),
  notes: z.string().optional(),
  hiring_manager_name: z.string().optional(),
  hiring_manager_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  hiring_manager_phone: z.string().optional(),
  hiring_manager_title: z.string().optional(),
  connections: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  initialData?: Application;
  onSuccess: (application: Application) => void;
  onCancel: () => void;
}

export default function ApplicationForm({ initialData, onSuccess, onCancel }: ApplicationFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditMode = !!initialData;
  
  // Convert arrays to comma-separated strings for the form
  const defaultValues: Partial<ApplicationFormValues> = initialData
    ? {
        ...initialData,
        tags: initialData.tags?.join(', ') || '',
        job_link: initialData.job_link || '',
        connections: initialData.connections?.join(', ') || '',
      }
    : {
        status: 'Applied',
        date_applied: format(new Date(), 'yyyy-MM-dd'),
      };
  
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: ApplicationFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert comma-separated strings to arrays
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      const connectionsArray = data.connections ? data.connections.split(',').map(conn => conn.trim()).filter(Boolean) : [];
      
      // Handle empty job link
      const jobLink = data.job_link === '' ? undefined : data.job_link;
      
      if (isEditMode && initialData) {
        // Update existing application
        const updatedApplication = await updateApplication(initialData.id, {
          ...data,
          job_link: jobLink,
          tags: tagsArray,
          connections: connectionsArray,
        });
        onSuccess(updatedApplication);
      } else {
        // Create new application
        const applicationData: ApplicationInput = {
          ...data,
          user_id: user.id,
          job_link: jobLink,
          tags: tagsArray,
          connections: connectionsArray,
        };
        
        const newApplication = await createApplication(applicationData);
        onSuccess(newApplication);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card fade-in">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              id="company"
              type="text"
              {...register('company')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              id="role"
              type="text"
              {...register('role')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="job_link" className="block text-sm font-medium text-gray-700">
              Job Listing URL (optional)
            </label>
            <input
              id="job_link"
              type="url"
              {...register('job_link')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.job_link && (
              <p className="mt-1 text-sm text-red-600">{errors.job_link.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="date_applied" className="block text-sm font-medium text-gray-700">
              Date Applied
            </label>
            <input
              id="date_applied"
              type="date"
              {...register('date_applied')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.date_applied && (
              <p className="mt-1 text-sm text-red-600">{errors.date_applied.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma-separated, optional)
            </label>
            <input
              id="tags"
              type="text"
              {...register('tags')}
              placeholder="e.g. Remote, Tech, Priority"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>
        </div>

        {/* Hiring Manager Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hiring Manager Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="hiring_manager_name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="hiring_manager_name"
                type="text"
                {...register('hiring_manager_name')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.hiring_manager_name && (
                <p className="mt-1 text-sm text-red-600">{errors.hiring_manager_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="hiring_manager_title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="hiring_manager_title"
                type="text"
                {...register('hiring_manager_title')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.hiring_manager_title && (
                <p className="mt-1 text-sm text-red-600">{errors.hiring_manager_title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="hiring_manager_email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="hiring_manager_email"
                type="email"
                {...register('hiring_manager_email')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.hiring_manager_email && (
                <p className="mt-1 text-sm text-red-600">{errors.hiring_manager_email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="hiring_manager_phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="hiring_manager_phone"
                type="tel"
                {...register('hiring_manager_phone')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.hiring_manager_phone && (
                <p className="mt-1 text-sm text-red-600">{errors.hiring_manager_phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Connections */}
        <div>
          <label htmlFor="connections" className="block text-sm font-medium text-gray-700">
            Company Connections (comma-separated, optional)
          </label>
          <input
            id="connections"
            type="text"
            {...register('connections')}
            placeholder="e.g. John (LinkedIn), Sarah (Ex-coworker)"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {errors.connections && (
            <p className="mt-1 text-sm text-red-600">{errors.connections.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={4}
            {...register('notes')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          ></textarea>
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="button"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Application' : 'Add Application'}
          </button>
        </div>
      </form>
    </div>
  );
} 