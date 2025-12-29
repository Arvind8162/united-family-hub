import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/NewAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useDonationCampaigns } from '@/hooks/useDonationCampaigns';
import { Loader2, Heart, Plus, Calendar, Users } from 'lucide-react';

const Donation = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const { campaigns, loading, createCampaign, donate } = useDonationCampaigns();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donateDialogOpen, setDonateDialogOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    category: 'community',
    target_amount: '',
    end_date: '',
    organizer: ''
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'education': return 'bg-primary text-primary-foreground';
      case 'healthcare': return 'bg-destructive text-destructive-foreground';
      case 'disaster-relief': return 'bg-accent text-accent-foreground';
      case 'community': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education': return '🎓';
      case 'healthcare': return '❤️';
      case 'disaster-relief': return '🆘';
      case 'community': return '🏘️';
      default: return '💝';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const getUrgencyLevel = (daysLeft: number) => {
    if (daysLeft <= 7) return { color: 'text-destructive', label: 'Urgent' };
    if (daysLeft <= 14) return { color: 'text-orange-500', label: 'Soon' };
    return { color: 'text-muted-foreground', label: 'Active' };
  };

  const openDonateDialog = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setDonateDialogOpen(true);
  };

  const handleDonate = async () => {
    if (!selectedCampaignId || !donationAmount) {
      toast({ title: "Error", description: "Please enter an amount", variant: "destructive" });
      return;
    }

    try {
      await donate(selectedCampaignId, parseFloat(donationAmount), donorName || undefined, donationMessage || undefined, isAnonymous);
      setDonationAmount('');
      setDonorName('');
      setDonationMessage('');
      setIsAnonymous(false);
      setDonateDialogOpen(false);
      toast({ title: "Success", description: "Thank you for your donation!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to process donation", variant: "destructive" });
    }
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.title || !newCampaign.description || !newCampaign.target_amount || !newCampaign.end_date || !newCampaign.organizer) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      await createCampaign({
        ...newCampaign,
        target_amount: parseFloat(newCampaign.target_amount),
        image_url: null
      });
      setNewCampaign({ title: '', description: '', category: 'community', target_amount: '', end_date: '', organizer: '' });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Campaign created successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create campaign", variant: "destructive" });
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
          <h1 className="text-4xl font-bold text-primary mb-4">Community Donations</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Support meaningful causes and help our community members in need.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No active campaigns.</p>
              {isAdmin && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create First Campaign
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => {
                const progressPercentage = getProgressPercentage(campaign.raised_amount || 0, campaign.target_amount);
                const urgency = getUrgencyLevel(campaign.days_left || 0);
                
                return (
                  <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-3xl mb-4">
                          {getCategoryIcon(campaign.category)}
                        </div>
                        <Badge className={getCategoryColor(campaign.category)}>
                          {campaign.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-primary mb-2">{campaign.title}</CardTitle>
                      <p className="text-muted-foreground text-sm leading-relaxed">{campaign.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">
                              {formatAmount(campaign.raised_amount || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground">Raised</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-muted-foreground">
                              {formatAmount(campaign.target_amount)}
                            </div>
                            <div className="text-xs text-muted-foreground">Goal</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-secondary flex items-center justify-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {campaign.days_left}
                            </div>
                            <div className="text-xs text-muted-foreground">Days Left</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm">
                            <div className="text-muted-foreground">Organized by:</div>
                            <div className="font-medium">{campaign.organizer}</div>
                            <div className={`text-xs ${urgency.color} font-medium`}>
                              {urgency.label}
                            </div>
                          </div>
                          {user ? (
                            <Button onClick={() => openDonateDialog(campaign.id)}>
                              <Heart className="mr-2 h-4 w-4" /> Donate
                            </Button>
                          ) : (
                            <Button variant="outline" onClick={() => toast({ title: "Login Required", description: "Please login to donate" })}>
                              <Heart className="mr-2 h-4 w-4" /> Donate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {isAdmin && (
            <div className="text-center mt-12">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Plus className="mr-2 h-4 w-4" /> Create Donation Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Donation Campaign</DialogTitle>
                    <DialogDescription>Start a new fundraising campaign for the community.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Campaign Title *</Label>
                      <Input id="title" value={newCampaign.title} onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})} placeholder="Campaign name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={newCampaign.category} onValueChange={(value) => setNewCampaign({...newCampaign, category: value})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="disaster-relief">Disaster Relief</SelectItem>
                            <SelectItem value="community">Community</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="target">Target Amount (₹) *</Label>
                        <Input id="target" type="number" value={newCampaign.target_amount} onChange={(e) => setNewCampaign({...newCampaign, target_amount: e.target.value})} placeholder="100000" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="end_date">End Date *</Label>
                        <Input id="end_date" type="date" value={newCampaign.end_date} onChange={(e) => setNewCampaign({...newCampaign, end_date: e.target.value})} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="organizer">Organizer *</Label>
                        <Input id="organizer" value={newCampaign.organizer} onChange={(e) => setNewCampaign({...newCampaign, organizer: e.target.value})} placeholder="Committee name" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" value={newCampaign.description} onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})} placeholder="Describe the cause" rows={3} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateCampaign}>Create Campaign</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Donate Dialog */}
      <Dialog open={donateDialogOpen} onOpenChange={setDonateDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
            <DialogDescription>Support this cause with your contribution.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input id="amount" type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} placeholder="1000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="donorName">Your Name</Label>
              <Input id="donorName" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Your name (optional)" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea id="message" value={donationMessage} onChange={(e) => setDonationMessage(e.target.value)} placeholder="Leave a message of support" rows={2} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(checked as boolean)} />
              <Label htmlFor="anonymous" className="text-sm">Make this donation anonymous</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDonateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDonate}>
              <Heart className="mr-2 h-4 w-4" /> Donate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Donation;
