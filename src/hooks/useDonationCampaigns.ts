import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { supabase } from '../integrations/supabase/client';

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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('donation_campaigns')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate additional fields
      const campaignsWithCounts = (data || []).map((campaign: any) => {
        const endDate = new Date(campaign.end_date);
        const today = new Date();
        const timeDiff = endDate.getTime() - today.getTime();
        const days_left = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return {
          ...campaign,
          days_left: days_left > 0 ? days_left : 0
        };
      });

      setCampaigns(campaignsWithCounts);
    } catch (error) {
      console.error('Error fetching donation campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<DonationCampaign, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'raised_amount' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { data, error } = await (supabase as any)
        .from('donation_campaigns')
        .insert([{
          ...campaignData,
          created_by: user.id,
          raised_amount: 0,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchCampaigns();
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  };

  const donate = async (campaignId: string, amount: number, donorName?: string, message?: string, isAnonymous: boolean = false) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { data, error } = await (supabase as any)
        .from('donations')
        .insert([{
          campaign_id: campaignId,
          donor_id: user.id,
          amount,
          donor_name: donorName,
          message,
          is_anonymous: isAnonymous,
          payment_status: 'completed' // In real app, this would be 'pending' until payment is processed
        }])
        .select()
        .single();

      if (error) throw error;

      // Update campaign raised amount using the database function
      await (supabase as any).rpc('increment_donation_amount', {
        campaign_id: campaignId,
        amount_to_add: amount
      });

      await fetchCampaigns();
      return data;
    } catch (error) {
      console.error('Error donating to campaign:', error);
      throw error;
    }
  };

  const updateCampaign = async (id: string, campaignData: Partial<DonationCampaign>) => {
    try {
      const { error } = await (supabase as any)
        .from('donation_campaigns')
        .update(campaignData)
        .eq('id', id);

      if (error) throw error;
      await fetchCampaigns();
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  };

  const deactivateCampaign = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('donation_campaigns')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      await fetchCampaigns();
    } catch (error) {
      console.error('Error deactivating campaign:', error);
      throw error;
    }
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