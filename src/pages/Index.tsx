import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Heart, 
  MessageSquare, 
  ShoppingCart,
  UserPlus,
  Trophy,
  MapPin,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Index = () => {
  const { profile, isAuthenticated } = useAuth();

  const quickStats = [
    { icon: Users, label: 'Community Members', value: '2,847', color: 'text-blue-600' },
    { icon: Calendar, label: 'Upcoming Events', value: '12', color: 'text-green-600' },
    { icon: Briefcase, label: 'Active Jobs', value: '34', color: 'text-purple-600' },
    { icon: Heart, label: 'Active Campaigns', value: '8', color: 'text-red-600' },
  ];

  const featuredSections = [
    {
      title: 'Community Forum',
      description: 'Connect and share with fellow community members',
      icon: MessageSquare,
      link: '/community',
      badge: 'New Posts',
      badgeCount: '24'
    },
    {
      title: 'Local Events',
      description: 'Discover and join upcoming community events',
      icon: Calendar,
      link: '/events',
      badge: 'This Week',
      badgeCount: '5'
    },
    {
      title: 'Job Opportunities',
      description: 'Find local job postings and career opportunities',
      icon: Briefcase,
      link: '/job',
      badge: 'New Jobs',
      badgeCount: '8'
    },
    {
      title: 'Donation Campaigns',
      description: 'Support community causes and make a difference',
      icon: Heart,
      link: '/donation',
      badge: 'Urgent',
      badgeCount: '3'
    },
    {
      title: 'Buy & Sell',
      description: 'Local marketplace for community members',
      icon: ShoppingCart,
      link: '/buy-sell',
      badge: 'Fresh Items',
      badgeCount: '15'
    },
    {
      title: 'Family Directory',
      description: 'Find and connect with family members',
      icon: Users,
      link: '/family',
      badge: 'Updated',
      badgeCount: '42'
    }
  ];

  const recentActivity = [
    {
      type: 'event',
      title: 'Community Diwali Celebration',
      location: 'Community Center',
      time: 'Today at 6:00 PM',
      attendees: 45
    },
    {
      type: 'donation',
      title: 'Emergency Medical Fund for Sharma Family',
      raised: '₹45,000',
      target: '₹1,00,000',
      progress: 45
    },
    {
      type: 'job',
      title: 'Senior Software Developer',
      company: 'TechCorp India',
      location: 'Mumbai',
      posted: '2 hours ago'
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Welcome to Samaj Setu</CardTitle>
            <CardDescription>
              Connect with your community, find opportunities, and make a difference
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <Users className="w-8 h-8 text-blue-600 mx-auto" />
                <p className="text-sm font-medium">2,800+ Members</p>
              </div>
              <div className="space-y-2">
                <Calendar className="w-8 h-8 text-green-600 mx-auto" />
                <p className="text-sm font-medium">Weekly Events</p>
              </div>
              <div className="space-y-2">
                <Briefcase className="w-8 h-8 text-purple-600 mx-auto" />
                <p className="text-sm font-medium">Job Opportunities</p>
              </div>
              <div className="space-y-2">
                <Heart className="w-8 h-8 text-red-600 mx-auto" />
                <p className="text-sm font-medium">Community Support</p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/auth">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-primary-hover rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {profile?.full_name || 'Community Member'}!
                </h1>
                <p className="text-primary-foreground/80 text-lg">
                  Stay connected with your community and explore new opportunities.
                </p>
              </div>
              <div className="hidden md:block">
                <Trophy className="w-16 h-16 text-primary-foreground/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredSections.map((section, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
              <Link to={section.link}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <section.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {section.title}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {section.badgeCount}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {section.description}
                  </CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Recent Community Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  {activity.type === 'event' && (
                    <>
                      <Calendar className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{activity.location}</span>
                          </span>
                          <span>{activity.time}</span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{activity.attendees} attending</span>
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  {activity.type === 'donation' && (
                    <>
                      <Heart className="w-8 h-8 text-red-600" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.title}</h4>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Raised: {activity.raised}</span>
                            <span>Goal: {activity.target}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${activity.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {activity.type === 'job' && (
                    <>
                      <Briefcase className="w-8 h-8 text-purple-600" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{activity.company}</span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{activity.location}</span>
                          </span>
                          <span>{activity.posted}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;