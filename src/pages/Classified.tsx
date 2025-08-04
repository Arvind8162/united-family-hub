import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ClassifiedAd {
  id: number;
  title: string;
  description: string;
  category: 'services' | 'housing' | 'vehicles' | 'electronics' | 'furniture' | 'other';
  price: string;
  contact: string;
  location: string;
  postedBy: string;
  postedDate: string;
  image: string;
}

const Classified = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [classifiedAds] = useState<ClassifiedAd[]>([
    {
      id: 1,
      title: 'Experienced Home Tutor Available',
      description: 'Mathematics and Science tutor for grades 6-12. 10+ years experience. Available for home visits.',
      category: 'services',
      price: '₹500/hour',
      contact: '+91-98765-43210',
      location: 'Mumbai, India',
      postedBy: 'Dr. Rajesh Sharma',
      postedDate: '2025-01-20',
      image: 'fas fa-chalkboard-teacher'
    },
    {
      id: 2,
      title: '2BHK Apartment for Rent',
      description: 'Well-furnished 2BHK apartment in prime location. Family-friendly society with all amenities.',
      category: 'housing',
      price: '₹25,000/month',
      contact: '+91-98765-43211',
      location: 'Pune, India',
      postedBy: 'Priya Patel',
      postedDate: '2025-01-22',
      image: 'fas fa-home'
    },
    {
      id: 3,
      title: 'Honda City 2018 for Sale',
      description: 'Well-maintained Honda City 2018 model. Single owner, all documents clear. Recently serviced.',
      category: 'vehicles',
      price: '₹8,50,000',
      contact: '+91-98765-43212',
      location: 'Bangalore, India',
      postedBy: 'Arjun Kumar',
      postedDate: '2025-01-25',
      image: 'fas fa-car'
    },
    {
      id: 4,
      title: 'iPhone 13 Pro for Sale',
      description: 'iPhone 13 Pro 128GB in excellent condition. All accessories included with original box.',
      category: 'electronics',
      price: '₹65,000',
      contact: '+91-98765-43213',
      location: 'Delhi, India',
      postedBy: 'Kavya Singh',
      postedDate: '2025-01-26',
      image: 'fas fa-mobile-alt'
    },
    {
      id: 5,
      title: 'Dining Table Set',
      description: 'Beautiful 6-seater dining table with chairs. Solid wood construction in excellent condition.',
      category: 'furniture',
      price: '₹18,000',
      contact: '+91-98765-43214',
      location: 'Ahmedabad, India',
      postedBy: 'Ramesh Joshi',
      postedDate: '2025-01-28',
      image: 'fas fa-utensils'
    },
    {
      id: 6,
      title: 'Wedding Photography Services',
      description: 'Professional wedding photographer with 8+ years experience. Affordable packages available.',
      category: 'services',
      price: 'Starting ₹25,000',
      contact: '+91-98765-43215',
      location: 'Mumbai, India',
      postedBy: 'Sita Photographer',
      postedDate: '2025-01-29',
      image: 'fas fa-camera'
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'services', label: 'Services' },
    { value: 'housing', label: 'Housing' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'other', label: 'Other' }
  ];

  const filteredAds = classifiedAds.filter(ad => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleContact = (ad: ClassifiedAd) => {
    toast({
      title: "Contact Information",
      description: `Contact ${ad.postedBy} at ${ad.contact}`,
    });
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <Card key={ad.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className={`${ad.image} text-primary`}></i>
                    </div>
                    <Badge className={getCategoryColor(ad.category)}>
                      {ad.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-primary">{ad.title}</CardTitle>
                  <div className="text-2xl font-bold text-secondary">{ad.price}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm leading-relaxed">{ad.description}</p>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-primary w-4"></i>
                        <span className="text-muted-foreground">{ad.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-user text-primary w-4"></i>
                        <span className="text-muted-foreground">{ad.postedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-calendar text-primary w-4"></i>
                        <span className="text-muted-foreground">{formatDate(ad.postedDate)}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full mt-4"
                      onClick={() => handleContact(ad)}
                    >
                      <i className="fas fa-phone mr-2"></i>
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAds.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
              <p className="text-muted-foreground">No classified ads found matching your criteria.</p>
            </div>
          )}

          {isAdmin && (
            <div className="text-center mt-12">
              <Button
                size="lg"
                onClick={() => toast({
                  title: "Post Classified Ad",
                  description: "This feature will be available soon!",
                })}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <i className="fas fa-plus mr-2"></i>
                Post Classified Ad
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classified;