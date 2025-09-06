import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/SupabaseAuthContext';

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
      // TODO: Enable when classified_ads table is created
      // const { data, error } = await supabase
      //   .from('classified_ads')
      //   .select(`
      //     *,
      //     profiles:posted_by(full_name)
      //   `)
      //   .eq('is_active', true)
      //   .order('created_at', { ascending: false });

      // if (error) throw error;
      setAds([]); // Return empty array for now
    } catch (error) {
      console.error('Error fetching classified ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAd = async (adData: Omit<ClassifiedAd, 'id' | 'created_at' | 'updated_at' | 'posted_by' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');

    // TODO: Enable when classified_ads table is created
    // const { data, error } = await supabase
    //   .from('classified_ads')
    //   .insert([{
    //     ...adData,
    //     posted_by: user.id,
    //     is_active: true
    //   }])
    //   .select()
    //   .single();

    // if (error) throw error;
    
    // await fetchAds();
    // return data;
    
    console.log('Creating ad (disabled):', adData);
    return null;
  };

  const updateAd = async (id: string, adData: Partial<ClassifiedAd>) => {
    // TODO: Enable when classified_ads table is created
    // const { error } = await supabase
    //   .from('classified_ads')
    //   .update(adData)
    //   .eq('id', id);

    // if (error) throw error;
    
    // await fetchAds();
    console.log('Updating ad (disabled):', id, adData);
  };

  const deleteAd = async (id: string) => {
    // TODO: Enable when classified_ads table is created
    // const { error } = await supabase
    //   .from('classified_ads')
    //   .update({ is_active: false })
    //   .eq('id', id);

    // if (error) throw error;
    
    // await fetchAds();
    console.log('Deleting ad (disabled):', id);
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