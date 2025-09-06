import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchFamilyMembers = async () => {
    // TODO: Enable when family_members table is created
    setFamilyMembers([]);
  };

  const createFamilyMember = async (memberData: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at' | 'added_by'>) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Creating family member (disabled):', memberData);
    return null;
  };

  const updateFamilyMember = async (id: string, memberData: Partial<FamilyMember>) => {
    console.log('Updating family member (disabled):', id, memberData);
  };

  const deleteFamilyMember = async (id: string) => {
    console.log('Deleting family member (disabled):', id);
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