import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchEvents = async () => {
    // TODO: Enable when events table is created
    setEvents([]);
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Creating event (disabled):', eventData);
    return null;
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    console.log('Updating event (disabled):', id, eventData);
  };

  const deleteEvent = async (id: string) => {
    console.log('Deleting event (disabled):', id);
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Registering for event (disabled):', eventId);
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!user) throw new Error('User must be authenticated');
    console.log('Unregistering from event (disabled):', eventId);
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