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
import { useMarketplaceItems } from '@/hooks/useMarketplaceItems';
import { Loader2, MapPin, User, Calendar, Phone, Plus, Search, ShoppingCart } from 'lucide-react';

const BuySell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { items, loading, createItem } = useMarketplaceItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'electronics' as const,
    price: '',
    condition: 'good' as const,
    location: ''
  });

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
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electronics': return '📱';
      case 'furniture': return '🪑';
      case 'clothing': return '👕';
      case 'books': return '📚';
      case 'sports': return '⚽';
      default: return '📦';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-500/20 text-green-700';
      case 'like-new': return 'bg-blue-500/20 text-blue-700';
      case 'good': return 'bg-yellow-500/20 text-yellow-700';
      case 'fair': return 'bg-orange-500/20 text-orange-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleContact = (item: any) => {
    toast({ title: "Contact Seller", description: `Item: ${item.title}. Please message the seller through the platform.` });
  };

  const handleBuyNow = (item: any) => {
    toast({ title: "Buy Now", description: `Initiating purchase for "${item.title}"` });
  };

  const handleCreateItem = async () => {
    if (!newItem.title || !newItem.description || !newItem.price || !newItem.location) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      await createItem({
        ...newItem,
        price: parseFloat(newItem.price),
        images: null
      });
      setNewItem({ title: '', description: '', category: 'electronics', price: '', condition: 'good', location: '' });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Item listed successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to list item", variant: "destructive" });
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
          <h1 className="text-4xl font-bold text-primary mb-4">Buy & Sell Marketplace</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover great deals and sell your items within our trusted community.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-6 space-y-4">
            <Input
              type="text"
              placeholder="Search items..."
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

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No items found.</p>
              {user && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Sell Your First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className={`hover:shadow-lg transition-shadow duration-300 ${item.is_sold ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-3xl">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                        <Badge className={getConditionColor(item.condition)}>{item.condition}</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                    <div className="text-2xl font-bold text-secondary">{formatPrice(item.price)}</div>
                    {item.is_sold && <Badge variant="destructive">SOLD</Badge>}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{item.description}</p>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                      
                      {!item.is_sold && (
                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" size="sm" onClick={() => handleContact(item)} className="flex-1">
                            <Phone className="mr-2 h-4 w-4" /> Contact
                          </Button>
                          <Button size="sm" onClick={() => handleBuyNow(item)} className="flex-1">
                            <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
                          </Button>
                        </div>
                      )}
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
                    <Plus className="mr-2 h-4 w-4" /> Sell an Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Sell an Item</DialogTitle>
                    <DialogDescription>List your item for sale in the marketplace.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input id="title" value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} placeholder="What are you selling?" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={newItem.category} onValueChange={(value: any) => setNewItem({...newItem, category: value})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="condition">Condition *</Label>
                        <Select value={newItem.condition} onValueChange={(value: any) => setNewItem({...newItem, condition: value})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input id="price" type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} placeholder="0" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" value={newItem.location} onChange={(e) => setNewItem({...newItem, location: e.target.value})} placeholder="City, State" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} placeholder="Describe your item" rows={3} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateItem}>List Item</Button>
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

export default BuySell;
