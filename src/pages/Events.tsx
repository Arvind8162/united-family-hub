import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'festival' | 'meeting' | 'social' | 'religious';
  attendees: number;
}

const Events = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Annual Community Gathering',
      date: '2025-02-15',
      time: '6:00 PM',
      location: 'Community Hall',
      description: 'Join us for our annual community gathering with traditional food, cultural programs, and networking.',
      category: 'social',
      attendees: 150
    },
    {
      id: 2,
      title: 'Diwali Celebration',
      date: '2025-10-31',
      time: '7:00 PM',
      location: 'Main Auditorium',
      description: 'Celebrate the festival of lights with our community. Cultural performances, traditional sweets, and more!',
      category: 'festival',
      attendees: 300
    },
    {
      id: 3,
      title: 'Monthly Committee Meeting',
      date: '2025-01-30',
      time: '10:00 AM',
      location: 'Conference Room',
      description: 'Monthly committee meeting to discuss community matters and upcoming initiatives.',
      category: 'meeting',
      attendees: 25
    },
    {
      id: 4,
      title: 'Youth Workshop',
      date: '2025-02-05',
      time: '2:00 PM',
      location: 'Activity Center',
      description: 'Career guidance and skill development workshop for our youth community members.',
      category: 'social',
      attendees: 80
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'social'
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const event: Event = {
      id: events.length + 1,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description,
      category: newEvent.category as any,
      attendees: 0
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      category: 'social'
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Event added successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Community Events</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with all our community events, festivals, and gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl text-primary">{event.title}</CardTitle>
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-calendar text-primary"></i>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-clock text-primary"></i>
                    <span>{event.time}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                    <span>{event.location}</span>
                  </div>
                  <p className="text-card-foreground leading-relaxed">{event.description}</p>
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <i className="fas fa-users text-primary"></i>
                      <span>{event.attendees} attending</span>
                    </div>
                    <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                      Register
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <i className="fas fa-plus mr-2"></i>
                  Add New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event for the family community.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      placeholder="Enter event location"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="social">Social</option>
                      <option value="festival">Festival</option>
                      <option value="meeting">Meeting</option>
                      <option value="religious">Religious</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Enter event description"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEvent}>
                    Add Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;