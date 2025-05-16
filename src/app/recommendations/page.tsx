'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { getJobRecommendations } from '@/lib/ai';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  postedDate: string;
  url: string;
  source: string;
}

export default function Recommendations() {
  const { user } = useAuth();
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    jobTitle: 'Software Developer',
    location: '',
    skills: ['React', 'JavaScript', 'TypeScript']
  });
  const [formValues, setFormValues] = useState(searchParams);

  useEffect(() => {
    if (user) {
      // Define fetchRecommendations inside useEffect
      const fetchRecommendations = async () => {
        try {
          setIsLoading(true);
          const results = await getJobRecommendations(
            searchParams.jobTitle,
            searchParams.location,
            searchParams.skills
          );
          setJobListings(results);
        } catch (error) {
          console.error('Error fetching job recommendations:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchRecommendations();
    } else {
      setIsLoading(false);
    }
  }, [user, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      ...formValues,
      skills: formValues.skills.filter(skill => skill.trim() !== '')
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...formValues.skills];
    updatedSkills[index] = value;
    setFormValues({
      ...formValues,
      skills: updatedSkills
    });
  };

  const addSkillField = () => {
    setFormValues({
      ...formValues,
      skills: [...formValues.skills, '']
    });
  };

  const removeSkillField = (index: number) => {
    const updatedSkills = formValues.skills.filter((_, i) => i !== index);
    setFormValues({
      ...formValues,
      skills: updatedSkills
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Job Recommendations</h1>
        <p className="mb-4">Please sign in to view personalized job recommendations</p>
        <Link 
          href="/auth/signin"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Job Recommendations</h1>
        <p className="text-gray-600">Find job opportunities that match your skills and experience</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Search Jobs</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                id="jobTitle"
                type="text"
                value={formValues.jobTitle}
                onChange={(e) => setFormValues({...formValues, jobTitle: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Software Developer"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formValues.location}
                onChange={(e) => setFormValues({...formValues, location: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Remote, New York, London"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="space-y-2">
              {formValues.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., JavaScript, React, SQL"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkillField(index)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    disabled={formValues.skills.length <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSkillField}
              className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add another skill
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search Jobs
            </button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4">Finding the best job matches for you...</p>
        </div>
      ) : jobListings.length > 0 ? (
        <div className="space-y-6">
          {jobListings.map((job) => (
            <div key={job.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <div className="mt-1">
                      <span className="text-gray-700 font-medium">{job.company}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">{job.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {job.source}
                    </span>
                    <span className="text-gray-500 text-sm mt-1">
                      {formatDate(job.postedDate)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-600">{job.description}</p>
                </div>
                
                {job.salary && (
                  <div className="mt-4">
                    <p className="text-gray-800 font-medium">{job.salary}</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-between items-center">
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply Now
                  </a>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white shadow rounded-lg p-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No job matches found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or adding different skills
          </p>
        </div>
      )}
    </div>
  );
} 