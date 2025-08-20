import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/SupabaseAuthContext';

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

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles:posted_by(full_name),
          job_applications(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get application status for current user
      if (user) {
        const { data: applications } = await supabase
          .from('job_applications')
          .select('job_id')
          .eq('applicant_id', user.id);

        const appliedJobIds = new Set(applications?.map(a => a.job_id) || []);
        
        const jobsWithStatus = data?.map(job => ({
          ...job,
          applications_count: job.job_applications?.length || 0,
          has_applied: appliedJobIds.has(job.id)
        })) || [];

        setJobs(jobsWithStatus);
      } else {
        setJobs(data || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'posted_by' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
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
  };

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    const { error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', id);

    if (error) throw error;
    
    await fetchJobs();
  };

  const deleteJob = async (id: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    
    await fetchJobs();
  };

  const applyForJob = async (jobId: string, coverLetter?: string) => {
    if (!user) throw new Error('User must be authenticated');

    const { error } = await supabase
      .from('job_applications')
      .insert([{
        job_id: jobId,
        applicant_id: user.id,
        cover_letter: coverLetter,
        status: 'pending'
      }]);

    if (error) throw error;
    
    await fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  return {
    jobs,
    loading,
    createJob,
    updateJob,
    deleteJob,
    applyForJob,
    refresh: fetchJobs
  };
};