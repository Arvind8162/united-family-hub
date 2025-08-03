import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Settings, Shield } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();

  const adminStats = [
    {
      title: "Total Users",
      value: "156",
      description: "Active family members",
      icon: Users,
      color: "bg-primary"
    },
    {
      title: "Events This Month",
      value: "12",
      description: "Upcoming events",
      icon: Calendar,
      color: "bg-secondary"
    },
    {
      title: "System Status",
      value: "Online",
      description: "All systems operational",
      icon: Shield,
      color: "bg-accent"
    },
    {
      title: "Settings",
      value: "Configure",
      description: "System configuration",
      icon: Settings,
      color: "bg-muted"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.username}
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
            Administrator
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.color}`}>
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest admin actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Event created by admin</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-md bg-accent hover:bg-accent/80 transition-colors">
                <div className="font-medium">Manage Users</div>
                <div className="text-sm text-muted-foreground">Add, edit, or remove users</div>
              </button>
              <button className="w-full text-left p-3 rounded-md bg-accent hover:bg-accent/80 transition-colors">
                <div className="font-medium">Event Management</div>
                <div className="text-sm text-muted-foreground">Create and manage events</div>
              </button>
              <button className="w-full text-left p-3 rounded-md bg-accent hover:bg-accent/80 transition-colors">
                <div className="font-medium">System Settings</div>
                <div className="text-sm text-muted-foreground">Configure system preferences</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;