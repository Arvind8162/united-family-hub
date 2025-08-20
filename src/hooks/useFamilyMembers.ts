import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/SupabaseAuthContext';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string | null;
  email: string | null;
  location: string | null;
  photo_url: string | null;
  added_by: string;
  created_at: string;
  updated_at: string;
}

export const useFamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFamilyMember = async (memberData: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at' | 'added_by'>) => {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
      .from('family_members')
      .insert([{
        ...memberData,
        added_by: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    
    await fetchFamilyMembers();
    return data;
  };

  const updateFamilyMember = async (id: string, memberData: Partial<FamilyMember>) => {
    const { error } = await supabase
      .from('family_members')
      .update(memberData)
      .eq('id', id);

    if (error) throw error;
    
    await fetchFamilyMembers();
  };

  const deleteFamilyMember = async (id: string) => {
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    await fetchFamilyMembers();
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  return {
    familyMembers,
    loading,
    createFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    refresh: fetchFamilyMembers
  };
};