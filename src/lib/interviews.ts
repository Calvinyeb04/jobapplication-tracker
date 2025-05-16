import { supabase } from './supabase';

export type Interview = {
  id: string;
  application_id: string;
  scheduled_date: string;
  location?: string;
  notes?: string;
  completed: boolean;
  created_at: string;
};

export type InterviewInput = Omit<Interview, 'id' | 'created_at'>;

export async function createInterview(interviewData: InterviewInput) {
  const { data, error } = await supabase
    .from('interviews')
    .insert([interviewData])
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0] as Interview;
}

export async function getInterviewsByApplicationId(applicationId: string) {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('application_id', applicationId)
    .order('scheduled_date', { ascending: true });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Interview[];
}

export async function getUserInterviews(userId: string) {
  const { data, error } = await supabase
    .from('interviews')
    .select(`
      *,
      applications!inner (
        id,
        company,
        role,
        user_id
      )
    `)
    .eq('applications.user_id', userId)
    .order('scheduled_date', { ascending: true });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateInterview(id: string, interviewData: Partial<Interview>) {
  const { data, error } = await supabase
    .from('interviews')
    .update(interviewData)
    .eq('id', id)
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0] as Interview;
}

export async function deleteInterview(id: string) {
  const { error } = await supabase
    .from('interviews')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
} 