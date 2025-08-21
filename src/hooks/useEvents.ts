import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/SupabaseAuthContext';

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
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_registrations!inner(count)
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Get registration status for current user
      if (user) {
        const { data: registrations } = await supabase
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id);

        const registeredEventIds = new Set(registrations?.map(r => r.event_id) || []);
        
        const eventsWithStatus = data?.map(event => ({
          ...event,
          attendees_count: event.event_registrations?.length || 0,
          is_registered: registeredEventIds.has(event.id)
        })) || [];

        setEvents(eventsWithStatus as unknown as Event[]);
      } else {
        setEvents((data || []) as unknown as Event[]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
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
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    const { error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id);

    if (error) throw error;
    
    await fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    await fetchEvents();
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) throw new Error('User must be authenticated');

    const { error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        user_id: user.id
      }]);

    if (error) throw error;
    
    await fetchEvents();
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!user) throw new Error('User must be authenticated');

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;
    
    await fetchEvents();
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