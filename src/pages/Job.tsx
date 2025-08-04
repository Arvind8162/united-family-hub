import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  experience: string;
  salary: string;
  description: string;
  postedBy: string;
  postedDate: string;
}

const Job = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [jobs] = useState<Job[]>([
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Solutions Pvt Ltd',
      location: 'Mumbai, India',
      type: 'full-time',
      experience: '2-4 years',
      salary: '₹8-12 LPA',
      description: 'Looking for a skilled software engineer with experience in React, Node.js, and cloud technologies.',
      postedBy: 'Rajesh Patel',
      postedDate: '2025-01-15'
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'Growth Marketing Inc',
      location: 'Bangalore, India',
      type: 'full-time',
      experience: '3-5 years',
      salary: '₹10-15 LPA',
      description: 'Seeking an experienced marketing manager to lead digital marketing campaigns and brand strategy.',
      postedBy: 'Priya Sharma',
      postedDate: '2025-01-20'
    },
    {
      id: 3,
      title: 'Data Analyst',
      company: 'Analytics Pro',
      location: 'Remote',
      type: 'remote',
      experience: '1-3 years',
      salary: '₹6-9 LPA',
      description: 'Remote data analyst position with focus on business intelligence and data visualization.',
      postedBy: 'Arjun Gupta',
      postedDate: '2025-01-22'
    },
    {
      id: 4,
      title: 'Graphic Designer',
      company: 'Creative Studios',
      location: 'Delhi, India',
      type: 'part-time',
      experience: '1-2 years',
      salary: '₹25,000-40,000/month',
      description: 'Part-time graphic designer for creating marketing materials and brand assets.',
      postedBy: 'Kavya Singh',
      postedDate: '2025-01-25'
    }
  ]);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-primary text-primary-foreground';
      case 'part-time': return 'bg-secondary text-secondary-foreground';
      case 'contract': return 'bg-accent text-accent-foreground';
      case 'remote': return 'bg-muted text-muted-foreground';
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

  const handleApply = (job: Job) => {
    toast({
      title: "Application Submitted",
      description: `Your application for ${job.title} at ${job.company} has been submitted!`,
    });
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Job Opportunities</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover career opportunities shared by our community members.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search jobs, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl text-primary">{job.title}</CardTitle>
                    <Badge className={getTypeColor(job.type)}>
                      {job.type}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <i className="fas fa-building text-primary"></i>
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="fas fa-map-marker-alt text-primary"></i>
                      <span>{job.location}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Experience:</span>
                        <div className="font-medium">{job.experience}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Salary:</span>
                        <div className="font-medium text-primary">{job.salary}</div>
                      </div>
                    </div>
                    
                    <p className="text-card-foreground leading-relaxed">{job.description}</p>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        <div>Posted by: <span className="font-medium">{job.postedBy}</span></div>
                        <div>Date: {formatDate(job.postedDate)}</div>
                      </div>
                      <Button
                        onClick={() => handleApply(job)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
              <p className="text-muted-foreground">No jobs found matching your search.</p>
            </div>
          )}

          {isAdmin && (
            <div className="text-center mt-12">
              <Button
                size="lg"
                onClick={() => toast({
                  title: "Post Job",
                  description: "This feature will be available soon!",
                })}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <i className="fas fa-plus mr-2"></i>
                Post New Job
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Job;