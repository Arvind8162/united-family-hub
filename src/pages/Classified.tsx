import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/NewAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useClassifiedAds } from '@/hooks/useClassifiedAds';
import { Loader2, MapPin, User, Calendar, Phone, Plus, Search } from 'lucide-react';

const Classified = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { ads, loading, createAd } = useClassifiedAds();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    category: 'services' as const,
    price: '',
    contact_phone: '',
    location: ''
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'services', label: 'Services' },
    { value: 'housing', label: 'Housing' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'other', label: 'Other' }
  ];

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'services': return 'bg-primary text-primary-foreground';
      case 'housing': return 'bg-secondary text-secondary-foreground';
      case 'vehicles': return 'bg-accent text-accent-foreground';
      case 'electronics': return 'bg-muted text-muted-foreground';
      case 'furniture': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'services': return '🛠️';
      case 'housing': return '🏠';
      case 'vehicles': return '🚗';
      case 'electronics': return '📱';
      case 'furniture': return '🪑';
      default: return '📦';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleContact = (ad: any) => {
    if (ad.contact_phone) {
      toast({ title: "Contact Information", description: `Phone: ${ad.contact_phone}` });
    } else {
      toast({ title: "Contact", description: "Contact information not available" });
    }
  };

  const handleCreateAd = async () => {
    if (!newAd.title || !newAd.description || !newAd.location) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      await createAd({ ...newAd, images: null });
      setNewAd({ title: '', description: '', category: 'services', price: '', contact_phone: '', location: '' });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Ad posted successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to post ad", variant: "destructive" });
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
          <h1 className="text-4xl font-bold text-primary mb-4">Classified Ads</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Buy, sell, and discover services within our community.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-6 space-y-4">
            <Input
              type="text"
              placeholder="Search classified ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md mx-auto"
            />
            
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {filteredAds.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No classified ads found.</p>
              {user && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Post Your First Ad
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map((ad) => (
                <Card key={ad.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                        {getCategoryIcon(ad.category)}
                      </div>
                      <Badge className={getCategoryColor(ad.category)}>{ad.category}</Badge>
                    </div>
                    <CardTitle className="text-lg text-primary">{ad.title}</CardTitle>
                    {ad.price && <div className="text-2xl font-bold text-secondary">{ad.price}</div>}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{ad.description}</p>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{ad.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{formatDate(ad.created_at)}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-4" onClick={() => handleContact(ad)}>
                        <Phone className="mr-2 h-4 w-4" /> Contact Seller
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {user && (
            <div className="text-center mt-12">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Plus className="mr-2 h-4 w-4" /> Post Classified Ad
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Post Classified Ad</DialogTitle>
                    <DialogDescription>Create a new classified ad for the community.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input id="title" value={newAd.title} onChange={(e) => setNewAd({...newAd, title: e.target.value})} placeholder="What are you offering?" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={newAd.category} onValueChange={(value: any) => setNewAd({...newAd, category: value})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="services">Services</SelectItem>
                            <SelectItem value="housing">Housing</SelectItem>
                            <SelectItem value="vehicles">Vehicles</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" value={newAd.price} onChange={(e) => setNewAd({...newAd, price: e.target.value})} placeholder="₹0" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" value={newAd.description} onChange={(e) => setNewAd({...newAd, description: e.target.value})} placeholder="Describe your item or service" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" value={newAd.location} onChange={(e) => setNewAd({...newAd, location: e.target.value})} placeholder="City, State" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contact_phone">Contact Phone</Label>
                        <Input id="contact_phone" value={newAd.contact_phone} onChange={(e) => setNewAd({...newAd, contact_phone: e.target.value})} placeholder="+91-XXXXX-XXXXX" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateAd}>Post Ad</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classified;
