import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchJobs = async () => {
    // TODO: Enable when jobs table is created
    setJobs([]);
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'posted_by' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Creating job (disabled):', jobData);
    return null;
  };

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    console.log('Updating job (disabled):', id, jobData);
  };

  const deleteJob = async (id: string) => {
    console.log('Deleting job (disabled):', id);
  };

  const applyForJob = async (jobId: string, coverLetter?: string) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Applying for job (disabled):', jobId, coverLetter);
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