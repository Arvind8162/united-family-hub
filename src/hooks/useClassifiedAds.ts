import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchAds = async () => {
    setAds([]);
    setLoading(false);
  };

  const createAd = async (adData: Omit<ClassifiedAd, 'id' | 'created_at' | 'updated_at' | 'posted_by' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Creating ad (disabled):', adData);
    return null;
  };

  const updateAd = async (id: string, adData: Partial<ClassifiedAd>) => {
    console.log('Updating ad (disabled):', id, adData);
  };

  const deleteAd = async (id: string) => {
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