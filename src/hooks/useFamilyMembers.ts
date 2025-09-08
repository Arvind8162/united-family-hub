import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { supabase } from '../integrations/supabase/client';

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
      const { data, error } = await (supabase as any)
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
    
    try {
      const { data, error } = await (supabase as any)
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
    } catch (error) {
      console.error('Error creating family member:', error);
      throw error;
    }
  };

  const updateFamilyMember = async (id: string, memberData: Partial<FamilyMember>) => {
    try {
      const { error } = await (supabase as any)
        .from('family_members')
        .update(memberData)
        .eq('id', id);

      if (error) throw error;
      await fetchFamilyMembers();
    } catch (error) {
      console.error('Error updating family member:', error);
      throw error;
    }
  };

  const deleteFamilyMember = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchFamilyMembers();
    } catch (error) {
      console.error('Error deleting family member:', error);
      throw error;
    }
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