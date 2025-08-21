import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donation_campaigns')
        .select(`
          *,
          donations!inner(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const campaignsWithMetadata = data?.map(campaign => {
        const endDate = new Date(campaign.end_date);
        const today = new Date();
        const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          ...campaign,
          donors_count: campaign.donations?.length || 0,
          days_left: Math.max(0, daysLeft)
        };
      }) || [];

      setCampaigns(campaignsWithMetadata as unknown as DonationCampaign[]);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<DonationCampaign, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'raised_amount' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
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
  };

  const donate = async (campaignId: string, amount: number, donorName?: string, message?: string, isAnonymous: boolean = false) => {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
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

    // Update campaign raised amount
    const { error: updateError } = await supabase.rpc('increment_donation_amount' as any, {
      campaign_id: campaignId,
      amount_to_add: amount
    });

    if (updateError) {
      console.error('Error updating campaign amount:', updateError);
    }
    
    await fetchCampaigns();
    return data;
  };

  const updateCampaign = async (id: string, campaignData: Partial<DonationCampaign>) => {
    const { error } = await supabase
      .from('donation_campaigns')
      .update(campaignData)
      .eq('id', id);

    if (error) throw error;
    
    await fetchCampaigns();
  };

  const deactivateCampaign = async (id: string) => {
    const { error } = await supabase
      .from('donation_campaigns')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    
    await fetchCampaigns();
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