import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { supabase } from '../integrations/supabase/client';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'remote';
  experience_level: string;
  salary_range: string | null;
  description: string;
  requirements: string | null;
  is_active: boolean;
  posted_by: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
  applications_count?: number;
  has_applied?: boolean;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter: string | null;
  resume_url: string | null;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data: jobsData, error } = await (supabase as any)
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
        setLoading(false);
        return;
      }

      // Get application counts and user application status
      const jobsWithCounts = await Promise.all(
        (jobsData || []).map(async (job: any) => {
          const { count } = await (supabase as any)
            .from('job_applications')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', job.id);

          let has_applied = false;
          if (user) {
            const { data: application } = await (supabase as any)
              .from('job_applications')
              .select('id')
              .eq('job_id', job.id)
              .eq('applicant_id', user.id)
              .single();
            has_applied = !!application;
          }

          return {
            ...job,
            applications_count: count || 0,
            has_applied
          };
        })
      );

      setJobs(jobsWithCounts);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId?: string) => {
    try {
      let query = (supabase as any)
        .from('job_applications')
        .select('*')
        .order('applied_at', { ascending: false });

      if (jobId) {
        query = query.eq('job_id', jobId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'posted_by' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { data, error } = await (supabase as any)
        .from('jobs')
        .insert([{
          ...jobData,
          posted_by: user.id,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchJobs();
      return data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  };

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      const { error } = await (supabase as any)
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .eq('posted_by', user?.id);

      if (error) throw error;
      await fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('jobs')
        .update({ is_active: false })
        .eq('id', id)
        .eq('posted_by', user?.id);

      if (error) throw error;
      await fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  };

  const applyToJob = async (jobId: string, coverLetter?: string, resumeUrl?: string) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { data, error } = await (supabase as any)
        .from('job_applications')
        .insert([{
          job_id: jobId,
          applicant_id: user.id,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchJobs();
      return data;
    } catch (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: JobApplication['status']) => {
    try {
      const { error } = await (supabase as any)
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
      await fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    applications,
    loading,
    createJob,
    updateJob,
    deleteJob,
    applyToJob,
    updateApplicationStatus,
    fetchApplications,
    refresh: fetchJobs
  };
};