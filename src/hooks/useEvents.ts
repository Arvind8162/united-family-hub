import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { supabase } from '../integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: 'festival' | 'meeting' | 'social' | 'religious';
  max_attendees: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  attendees_count?: number;
  is_registered?: boolean;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data: eventsData, error } = await (supabase as any)
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Get registration counts and user registration status
      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event: any) => {
          const { count } = await (supabase as any)
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);

          let is_registered = false;
          if (user) {
            const { data: registration } = await (supabase as any)
              .from('event_registrations')
              .select('id')
              .eq('event_id', event.id)
              .eq('user_id', user.id)
              .single();
            is_registered = !!registration;
          }

          return {
            ...event,
            attendees_count: count || 0,
            is_registered
          };
        })
      );

      setEvents(eventsWithCounts);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { data, error } = await (supabase as any)
        .from('events')
        .insert([{
          ...eventData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchEvents();
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      const { error } = await (supabase as any)
        .from('events')
        .update(eventData)
        .eq('id', id);

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { error } = await (supabase as any)
        .from('event_registrations')
        .insert([{
          event_id: eventId,
          user_id: user.id
        }]);

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { error } = await (supabase as any)
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    refresh: fetchEvents
  };
};