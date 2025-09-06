import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchItems = async () => {
    // TODO: Enable when marketplace_items table is created
    setItems([]);
  };

  const createItem = async (itemData: Omit<MarketplaceItem, 'id' | 'created_at' | 'updated_at' | 'seller_id' | 'is_sold' | 'is_active'>) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Creating marketplace item (disabled):', itemData);
    return null;
  };

  const updateItem = async (id: string, itemData: Partial<MarketplaceItem>) => {
    console.log('Updating marketplace item (disabled):', id, itemData);
  };

  const markAsSold = async (id: string) => {
    console.log('Marking item as sold (disabled):', id);
  };

  const deleteItem = async (id: string) => {
    console.log('Deleting marketplace item (disabled):', id);
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