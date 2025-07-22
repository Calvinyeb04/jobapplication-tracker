import { supabase } from './supabase';
import { createOrUpdateDailyChallenge } from './dailyChallenges';

export type Application = {
  id: string;
  company: string;
  role: string;
  job_link?: string;
  date_applied: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  category?: 'Fall' | 'Spring' | 'Summer' | 'Winter' | 'General';
  tags?: string[];
  notes?: string;
  created_at: string;
  hiring_manager_name?: string;
  hiring_manager_email?: string;
  hiring_manager_phone?: string;
  hiring_manager_title?: string;
  connections?: string[];
};

export type ApplicationInput = Omit<Application, 'id' | 'created_at'> & {
  user_id: string;
};

export type SortKey = 'company' | 'role' | 'date_applied' | 'status';
export type SortOrder = 'asc' | 'desc';

export async function createApplication(applicationData: ApplicationInput) {
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Update daily challenge count
  try {
    await createOrUpdateDailyChallenge(applicationData.user_id);
  } catch (challengeError) {
    console.error('Error updating daily challenge:', challengeError);
    // Don't throw here - we still want to return the application even if challenge update fails
  }
  
  return data[0] as Application;
}

export async function getUserApplications(
  userId: string,
  sortKey: SortKey = 'date_applied',
  sortOrder: SortOrder = 'desc'
) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order(sortKey, { ascending: sortOrder === 'asc' });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Application[];
}

export async function getApplicationById(id: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Application;
}

export async function updateApplication(id: string, applicationData: Partial<Application>) {
  const { data, error } = await supabase
    .from('applications')
    .update(applicationData)
    .eq('id', id)
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0] as Application;
}

export async function deleteApplication(id: string) {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
}

export async function deleteAllApplications(userId: string) {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
} 