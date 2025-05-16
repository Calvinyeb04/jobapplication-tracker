import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bsjxrrlgswqxbtncsent.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzanhycmxnc3dxeGJ0bmNzZW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzczNDEsImV4cCI6MjA2MjkxMzM0MX0.GMvmjw2kKwYgozdcdBG-V8ng8biFMFYT-H6_yZBJibU';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          name: string | null;
          university: string | null;
          academic_level: string | null;
          major: string | null;
          preferred_job_type: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          name?: string | null;
          university?: string | null;
          academic_level?: string | null;
          major?: string | null;
          preferred_job_type?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          name?: string | null;
          university?: string | null;
          academic_level?: string | null;
          major?: string | null;
          preferred_job_type?: string[] | null;
          created_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          role: string;
          job_link: string | null;
          date_applied: string;
          status: string;
          tags: string[] | null;
          notes: string | null;
          created_at: string;
          hiring_manager_name: string | null;
          hiring_manager_email: string | null;
          hiring_manager_phone: string | null;
          hiring_manager_title: string | null;
          connections: string[] | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          role: string;
          job_link?: string | null;
          date_applied: string;
          status?: string;
          tags?: string[] | null;
          notes?: string | null;
          created_at?: string;
          hiring_manager_name?: string | null;
          hiring_manager_email?: string | null;
          hiring_manager_phone?: string | null;
          hiring_manager_title?: string | null;
          connections?: string[] | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          company?: string;
          role?: string;
          job_link?: string | null;
          date_applied?: string;
          status?: string;
          tags?: string[] | null;
          notes?: string | null;
          created_at?: string;
          hiring_manager_name?: string | null;
          hiring_manager_email?: string | null;
          hiring_manager_phone?: string | null;
          hiring_manager_title?: string | null;
          connections?: string[] | null;
        };
      };
      interviews: {
        Row: {
          id: string;
          application_id: string;
          scheduled_date: string;
          location: string | null;
          notes: string | null;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          scheduled_date: string;
          location?: string | null;
          notes?: string | null;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          scheduled_date?: string;
          location?: string | null;
          notes?: string | null;
          completed?: boolean;
          created_at?: string;
        };
      };
      rejections: {
        Row: {
          id: string;
          application_id: string;
          date_rejected: string;
          feedback: string | null;
          reapply_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          date_rejected: string;
          feedback?: string | null;
          reapply_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          date_rejected?: string;
          feedback?: string | null;
          reapply_date?: string | null;
          created_at?: string;
        };
      };
      job_recommendations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          company: string;
          link: string;
          description: string | null;
          date_recommended: string;
          viewed: boolean;
          applied: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          company: string;
          link: string;
          description?: string | null;
          date_recommended: string;
          viewed?: boolean;
          applied?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          company?: string;
          link?: string;
          description?: string | null;
          date_recommended?: string;
          viewed?: boolean;
          applied?: boolean;
          created_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_path: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_path: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          file_path?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
    };
  };
}; 