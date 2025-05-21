import { supabase } from './supabase';

export type DailyChallenge = {
  id: string;
  user_id: string;
  date: string;
  applications_count: number;
  goal_met: boolean;
  created_at: string;
  updated_at: string;
};

export async function getTodayChallenge(userId: string): Promise<DailyChallenge | null> {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  const { data, error } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
    console.error('Error fetching today\'s challenge:', error);
    throw new Error(error.message);
  }
  
  return data as DailyChallenge | null;
}

export async function createOrUpdateDailyChallenge(userId: string): Promise<DailyChallenge> {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  // First check if a challenge exists for today
  const { data: existingChallenge } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  
  if (existingChallenge) {
    // Update existing challenge
    const newCount = (existingChallenge.applications_count || 0) + 1;
    const goalMet = newCount >= 5;
    
    const { data, error } = await supabase
      .from('daily_challenges')
      .update({
        applications_count: newCount,
        goal_met: goalMet,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingChallenge.id)
      .select();
    
    if (error) {
      console.error('Error updating daily challenge:', error);
      throw new Error(error.message);
    }
    
    return data[0] as DailyChallenge;
  } else {
    // Create new challenge
    const { data, error } = await supabase
      .from('daily_challenges')
      .insert([{
        user_id: userId,
        date: today,
        applications_count: 1,
        goal_met: 1 >= 5 // Will be false unless the goal is 1
      }])
      .select();
    
    if (error) {
      console.error('Error creating daily challenge:', error);
      throw new Error(error.message);
    }
    
    return data[0] as DailyChallenge;
  }
}

export async function getWeekChallenges(userId: string): Promise<DailyChallenge[]> {
  // Get start of week (last 7 days)
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const { data, error } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('user_id', userId)
    .gte('date', weekAgo.toISOString().split('T')[0])
    .lte('date', today.toISOString().split('T')[0])
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching week challenges:', error);
    throw new Error(error.message);
  }
  
  return data as DailyChallenge[];
}
