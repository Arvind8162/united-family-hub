import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceItem {
  id: number;
  title: string;
  description: string;
  category: 'electronics' | 'furniture' | 'clothing' | 'books' | 'sports' | 'other';
  price: number;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  seller: string;
  contact: string;
  location: string;
  images: string[];
  postedDate: string;
  isSold: boolean;
}

const BuySell = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  
  const [items] = useState<MarketplaceItem[]>([
    {
      id: 1,
      title: 'MacBook Pro 2021',
      description: 'Excellent condition MacBook Pro with M1 chip. Perfect for students and professionals. Includes original charger and box.',
      category: 'electronics',
      price: 85000,
      condition: 'like-new',
      seller: 'Rajesh Kumar',
      contact: '+91-98765-43210',
      location: 'Mumbai, India',
      images: ['fas fa-laptop'],
      postedDate: '2025-01-25',
      isSold: false
    },
    {
      id: 2,
      title: 'Study Table with Chair',
      description: 'Solid wood study table with matching chair. Perfect for students. Very sturdy construction.',
      category: 'furniture',
      price: 8500,
      condition: 'good',
      seller: 'Priya Patel',
      contact: '+91-98765-43211',
      location: 'Pune, India',
      images: ['fas fa-chair'],
      postedDate: '2025-01-26',
      isSold: false
    },
    {
      id: 3,
      title: 'Engineering Textbooks Set',
      description: 'Complete set of Computer Science engineering books for all semesters. All books in good condition.',
      category: 'books',
      price: 12000,
      condition: 'good',
      seller: 'Arjun Singh',
      contact: '+91-98765-43212',
      location: 'Delhi, India',
      images: ['fas fa-book'],
      postedDate: '2025-01-27',
      isSold: true
    },
    {
      id: 4,
      title: 'Cricket Kit - Complete Set',
      description: 'Professional cricket kit including bat, pads, helmet, gloves, and bag. Lightly used.',
      category: 'sports',
      price: 15000,
      condition: 'like-new',
      seller: 'Vikram Sharma',
      contact: '+91-98765-43213',
      location: 'Bangalore, India',
      images: ['fas fa-baseball-ball'],
      postedDate: '2025-01-28',
      isSold: false
    },
    {
      id: 5,
      title: 'Designer Sarees Collection',
      description: 'Beautiful collection of 5 designer sarees. Perfect for weddings and festivals. Worn only once each.',
      category: 'clothing',
      price: 25000,
      condition: 'like-new',
      seller: 'Kavya Joshi',
      contact: '+91-98765-43214',
      location: 'Ahmedabad, India',
      images: ['fas fa-tshirt'],
      postedDate: '2025-01-29',
      isSold: false
    },
    {
      id: 6,
      title: 'Sony Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with excellent sound quality. Perfect for parties and outdoor activities.',
      category: 'electronics',
      price: 4500,
      condition: 'good',
      seller: 'Ramesh Gupta',
      contact: '+91-98765-43215',
      location: 'Chennai, India',
      images: ['fas fa-volume-up'],
      postedDate: '2025-01-30',
      isSold: false
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-5000', label: '₹0 - ₹5,000' },
    { value: '5000-15000', label: '₹5,000 - ₹15,000' },
    { value: '15000-50000', label: '₹15,000 - ₹50,000' },
    { value: '50000+', label: '₹50,000+' }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      if (priceRange === '0-5000') matchesPrice = item.price <= 5000;
      else if (priceRange === '5000-15000') matchesPrice = item.price > 5000 && item.price <= 15000;
      else if (priceRange === '15000-50000') matchesPrice = item.price > 15000 && item.price <= 50000;
      else if (priceRange === '50000+') matchesPrice = item.price > 50000;
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electronics': return 'bg-primary text-primary-foreground';
      case 'furniture': return 'bg-secondary text-secondary-foreground';
      case 'clothing': return 'bg-accent text-accent-foreground';
      case 'books': return 'bg-muted text-muted-foreground';
      case 'sports': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleContact = (item: MarketplaceItem) => {
    toast({
      title: "Contact Seller",
      description: `Contact ${item.seller} at ${item.contact}`,
    });
  };

  const handleBuyNow = (item: MarketplaceItem) => {
    toast({
      title: "Buy Now",
      description: `Initiating purchase for "${item.title}"`,
    });
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Buy & Sell Marketplace</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover great deals and sell your items within our trusted community.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-6 space-y-4">
            <Input
              type="text"
              placeholder="Search items, sellers, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md mx-auto"
            />
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="flex flex-wrap justify-center gap-2">
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
              
              <div className="flex flex-wrap justify-center gap-2">
                {priceRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={priceRange === range.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriceRange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className={`hover:shadow-lg transition-shadow duration-300 ${item.isSold ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className={`${item.images[0]} text-2xl text-primary`}></i>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <Badge className={getConditionColor(item.condition)}>
                        {item.condition}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                  <div className="text-2xl font-bold text-secondary">{formatPrice(item.price)}</div>
                  {item.isSold && (
                    <Badge variant="destructive">SOLD</Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-user text-primary w-4"></i>
                        <span className="text-muted-foreground">{item.seller}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-primary w-4"></i>
                        <span className="text-muted-foreground">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-calendar text-primary w-4"></i>
                        <span className="text-muted-foreground">{formatDate(item.postedDate)}</span>
                      </div>
                    </div>
                    
                    {!item.isSold && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContact(item)}
                          className="flex-1"
                        >
                          <i className="fas fa-phone mr-2"></i>
                          Contact
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleBuyNow(item)}
                          className="flex-1"
                        >
                          <i className="fas fa-shopping-cart mr-2"></i>
                          Buy Now
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
              <p className="text-muted-foreground">No items found matching your criteria.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => toast({
                title: "Sell Item",
                description: "Item listing feature will be available soon!",
              })}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <i className="fas fa-plus mr-2"></i>
              Sell an Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySell;