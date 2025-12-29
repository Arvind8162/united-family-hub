import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '@/contexts/NewAuthContext';
import { useToast } from '../hooks/use-toast';
import { useEvents } from '@/hooks/useEvents';
import { Loader2, Calendar, Clock, MapPin, Users, Plus, CheckCircle } from 'lucide-react';

const Events = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const { events, loading, createEvent, registerForEvent, unregisterFromEvent } = useEvents();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    event_date: '',
    event_time: '',
    location: '',
    description: '',
    category: 'social',
    max_attendees: ''
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'festival': return 'bg-accent text-accent-foreground';
      case 'meeting': return 'bg-primary text-primary-foreground';
      case 'social': return 'bg-secondary text-secondary-foreground';
      case 'religious': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.event_date || !newEvent.event_time || !newEvent.location) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      await createEvent({
        title: newEvent.title,
        event_date: newEvent.event_date,
        event_time: newEvent.event_time,
        location: newEvent.location,
        description: newEvent.description || null,
        category: newEvent.category as any,
        max_attendees: newEvent.max_attendees ? parseInt(newEvent.max_attendees) : null
      });
      setNewEvent({ title: '', event_date: '', event_time: '', location: '', description: '', category: 'social', max_attendees: '' });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Event created successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create event", variant: "destructive" });
    }
  };

  const handleRegister = async (eventId: string, isRegistered: boolean) => {
    if (!user) {
      toast({ title: "Error", description: "Please login to register for events", variant: "destructive" });
      return;
    }

    try {
      if (isRegistered) {
        await unregisterFromEvent(eventId);
        toast({ title: "Success", description: "You have unregistered from this event" });
      } else {
        await registerForEvent(eventId);
        toast({ title: "Success", description: "You have registered for this event!" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update registration", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Community Events</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with all our community events, festivals, and gatherings.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No events found.</p>
            {isAdmin && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create First Event
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl text-primary">{event.title}</CardTitle>
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{formatTime(event.event_time)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    {event.description && (
                      <p className="text-foreground leading-relaxed">{event.description}</p>
                    )}
                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{event.attendees_count || 0} attending{event.max_attendees ? ` / ${event.max_attendees} max` : ''}</span>
                      </div>
                      {user && (
                        <Button
                          variant={event.is_registered ? "outline" : "default"}
                          onClick={() => handleRegister(event.id, event.is_registered || false)}
                        >
                          {event.is_registered ? (
                            <><CheckCircle className="mr-2 h-4 w-4" /> Registered</>
                          ) : (
                            'Register'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="text-center mt-12">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="mr-2 h-4 w-4" /> Add New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>Create a new event for the community.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input id="title" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="Enter event title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input id="date" type="date" value={newEvent.event_date} onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time *</Label>
                      <Input id="time" type="time" value={newEvent.event_time} onChange={(e) => setNewEvent({...newEvent, event_time: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input id="location" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} placeholder="Enter event location" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={newEvent.category} onValueChange={(value) => setNewEvent({...newEvent, category: value})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="festival">Festival</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="religious">Religious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="max_attendees">Max Attendees</Label>
                      <Input id="max_attendees" type="number" value={newEvent.max_attendees} onChange={(e) => setNewEvent({...newEvent, max_attendees: e.target.value})} placeholder="Optional" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} placeholder="Enter event description" rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddEvent}>Create Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
