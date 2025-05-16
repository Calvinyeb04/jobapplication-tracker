import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export async function signUp(email: string, password: string, name: string) {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Insert user into database
  const { data, error } = await supabase
    .from('users')
    .insert([
      { email, password: hashedPassword, name }
    ])
    .select('id, email, name');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0] as AuthUser;
}

export async function signIn(email: string, password: string) {
  // Fetch user from database
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, password')
    .eq('email', email)
    .single();
  
  if (error || !data) {
    throw new Error('Invalid email or password');
  }
  
  // Verify password
  const valid = await bcrypt.compare(password, data.password);
  
  if (!valid) {
    throw new Error('Invalid email or password');
  }
  
  // Destructure to remove password from returned object
  const { password: _, ...user } = data;
  return user as AuthUser;
}

export async function getCurrentUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, university, academic_level, major, preferred_job_type')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data;
} 