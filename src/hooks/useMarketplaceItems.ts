import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/SupabaseAuthContext';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: 'electronics' | 'furniture' | 'clothing' | 'books' | 'sports' | 'other';
  price: number;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  images: string[] | null;
  location: string;
  is_sold: boolean;
  is_active: boolean;
  seller_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    phone?: string;
  };
}

export const useMarketplaceItems = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          profiles:seller_id(full_name, phone)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data || []) as unknown as MarketplaceItem[]);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Omit<MarketplaceItem, 'id' | 'created_at' | 'updated_at' | 'seller_id' | 'is_sold' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
      .from('marketplace_items')
      .insert([{
        ...itemData,
        seller_id: user.id,
        is_sold: false,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    
    await fetchItems();
    return data;
  };

  const updateItem = async (id: string, itemData: Partial<MarketplaceItem>) => {
    const { error } = await supabase
      .from('marketplace_items')
      .update(itemData)
      .eq('id', id);

    if (error) throw error;
    
    await fetchItems();
  };

  const markAsSold = async (id: string) => {
    const { error } = await supabase
      .from('marketplace_items')
      .update({ is_sold: true })
      .eq('id', id);

    if (error) throw error;
    
    await fetchItems();
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('marketplace_items')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    
    await fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    createItem,
    updateItem,
    markAsSold,
    deleteItem,
    refresh: fetchItems
  };
};