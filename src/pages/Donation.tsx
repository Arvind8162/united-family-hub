import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DonationCause {
  id: number;
  title: string;
  description: string;
  category: 'education' | 'healthcare' | 'disaster-relief' | 'community';
  targetAmount: number;
  raisedAmount: number;
  donors: number;
  daysLeft: number;
  organizer: string;
  image: string;
}

const Donation = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [donationCauses] = useState<DonationCause[]>([
    {
      id: 1,
      title: 'Education Fund for Underprivileged Children',
      description: 'Help provide quality education and school supplies for children from our community who need financial support.',
      category: 'education',
      targetAmount: 500000,
      raisedAmount: 325000,
      donors: 45,
      daysLeft: 25,
      organizer: 'Community Education Committee',
      image: 'fas fa-graduation-cap'
    },
    {
      id: 2,
      title: 'Medical Emergency Fund',
      description: 'Support family members facing medical emergencies and help cover treatment costs.',
      category: 'healthcare',
      targetAmount: 1000000,
      raisedAmount: 750000,
      donors: 82,
      daysLeft: 15,
      organizer: 'Healthcare Support Group',
      image: 'fas fa-heartbeat'
    },
    {
      id: 3,
      title: 'Community Center Renovation',
      description: 'Renovate and modernize our community center to better serve all family members.',
      category: 'community',
      targetAmount: 800000,
      raisedAmount: 480000,
      donors: 67,
      daysLeft: 40,
      organizer: 'Infrastructure Committee',
      image: 'fas fa-building'
    },
    {
      id: 4,
      title: 'Flood Relief Support',
      description: 'Emergency support for families affected by recent floods in our native region.',
      category: 'disaster-relief',
      targetAmount: 300000,
      raisedAmount: 280000,
      donors: 98,
      daysLeft: 5,
      organizer: 'Disaster Relief Team',
      image: 'fas fa-hand-holding-heart'
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'education': return 'bg-primary text-primary-foreground';
      case 'healthcare': return 'bg-destructive text-destructive-foreground';
      case 'disaster-relief': return 'bg-accent text-accent-foreground';
      case 'community': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleDonate = (cause: DonationCause) => {
    toast({
      title: "Donation Initiated",
      description: `Thank you for supporting "${cause.title}". Redirecting to payment gateway...`,
    });
  };

  const getUrgencyLevel = (daysLeft: number) => {
    if (daysLeft <= 7) return { color: 'text-destructive', label: 'Urgent' };
    if (daysLeft <= 14) return { color: 'text-orange-500', label: 'Soon' };
    return { color: 'text-muted-foreground', label: 'Active' };
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Community Donations</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Support meaningful causes and help our community members in need.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {donationCauses.map((cause) => {
              const progressPercentage = getProgressPercentage(cause.raisedAmount, cause.targetAmount);
              const urgency = getUrgencyLevel(cause.daysLeft);
              
              return (
                <Card key={cause.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <i className={`${cause.image} text-2xl text-primary`}></i>
                      </div>
                      <Badge className={getCategoryColor(cause.category)}>
                        {cause.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-primary mb-2">{cause.title}</CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">{cause.description}</p>
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
                            {formatAmount(cause.raisedAmount)}
                          </div>
                          <div className="text-xs text-muted-foreground">Raised</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-muted-foreground">
                            {formatAmount(cause.targetAmount)}
                          </div>
                          <div className="text-xs text-muted-foreground">Goal</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-secondary">
                            {cause.donors}
                          </div>
                          <div className="text-xs text-muted-foreground">Donors</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm">
                          <div className="text-muted-foreground">Organized by:</div>
                          <div className="font-medium">{cause.organizer}</div>
                          <div className={`text-xs ${urgency.color} font-medium`}>
                            {cause.daysLeft} days left • {urgency.label}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDonate(cause)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <i className="fas fa-heart mr-2"></i>
                          Donate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {isAdmin && (
            <div className="text-center mt-12">
              <Button
                size="lg"
                onClick={() => toast({
                  title: "Create Donation Campaign",
                  description: "This feature will be available soon!",
                })}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <i className="fas fa-plus mr-2"></i>
                Create Donation Campaign
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donation;