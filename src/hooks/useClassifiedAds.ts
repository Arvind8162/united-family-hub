import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { supabase } from '../integrations/supabase/client';

export interface ClassifiedAd {
  id: string;
  title: string;
  description: string;
  category: 'services' | 'housing' | 'vehicles' | 'electronics' | 'furniture' | 'other';
  price: string | null;
  contact_phone: string | null;
  location: string;
  images: string[] | null;
  is_active: boolean;
  posted_by: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
}

export const useClassifiedAds = () => {
  const [ads, setAds] = useState<ClassifiedAd[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('classified_ads')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching classified ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAd = async (adData: Omit<ClassifiedAd, 'id' | 'created_at' | 'updated_at' | 'posted_by' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { data, error } = await (supabase as any)
        .from('classified_ads')
        .insert([{
          ...adData,
          posted_by: user.id,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchAds();
      return data;
    } catch (error) {
      console.error('Error creating classified ad:', error);
      throw error;
    }
  };

  const updateAd = async (id: string, adData: Partial<ClassifiedAd>) => {
    try {
      const { error } = await (supabase as any)
        .from('classified_ads')
        .update(adData)
        .eq('id', id)
        .eq('posted_by', user?.id);

      if (error) throw error;
      await fetchAds();
    } catch (error) {
      console.error('Error updating classified ad:', error);
      throw error;
    }
  };

  const deleteAd = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('classified_ads')
        .update({ is_active: false })
        .eq('id', id)
        .eq('posted_by', user?.id);

      if (error) throw error;
      await fetchAds();
    } catch (error) {
      console.error('Error deleting classified ad:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return {
    ads,
    loading,
    createAd,
    updateAd,
    deleteAd,
    refresh: fetchAds
  };
};