import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'healthcare' | 'disaster-relief' | 'community';
  target_amount: number;
  raised_amount: number;
  end_date: string;
  image_url: string | null;
  organizer: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  donors_count?: number;
  days_left?: number;
}

export interface Donation {
  id: string;
  campaign_id: string;
  donor_id: string;
  amount: number;
  donor_name: string | null;
  is_anonymous: boolean;
  message: string | null;
  payment_status: 'pending' | 'completed' | 'failed';
  donated_at: string;
}

export const useDonationCampaigns = () => {
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    setCampaigns([]);
    setLoading(false);
  };

  const createCampaign = async (campaignData: Omit<DonationCampaign, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'raised_amount' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Creating campaign (disabled):', campaignData);
    return null;
  };

  const donate = async (campaignId: string, amount: number, donorName?: string, message?: string, isAnonymous: boolean = false) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Donating (disabled):', { campaignId, amount, donorName, message, isAnonymous });
    return null;
  };

  const updateCampaign = async (id: string, campaignData: Partial<DonationCampaign>) => {
    console.log('Updating campaign (disabled):', id, campaignData);
  };

  const deactivateCampaign = async (id: string) => {
    console.log('Deactivating campaign (disabled):', id);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    createCampaign,
    donate,
    updateCampaign,
    deactivateCampaign,
    refresh: fetchCampaigns
  };
};