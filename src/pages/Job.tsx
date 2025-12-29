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
import { useJobs } from '@/hooks/useJobs';
import { Loader2, Building, MapPin, Briefcase, DollarSign, Plus, Search, CheckCircle } from 'lucide-react';

const Job = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { jobs, loading, createJob, applyToJob } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_range: '',
    description: '',
    requirements: ''
  });

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
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleApply = async () => {
    if (!selectedJobId) return;
    try {
      await applyToJob(selectedJobId, coverLetter || undefined);
      setCoverLetter('');
      setApplyDialogOpen(false);
      toast({ title: "Success", description: "Application submitted successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to apply", variant: "destructive" });
    }
  };

  const openApplyDialog = (jobId: string) => {
    setSelectedJobId(jobId);
    setApplyDialogOpen(true);
  };

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.description) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      await createJob(newJob as any);
      setNewJob({ title: '', company: '', location: '', job_type: 'full-time', experience_level: 'mid', salary_range: '', description: '', requirements: '' });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Job posted successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to post job", variant: "destructive" });
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

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No jobs found.</p>
              {user && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Post First Job
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl text-primary">{job.title}</CardTitle>
                      <Badge className={getTypeColor(job.job_type)}>{job.job_type}</Badge>
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Experience:</span>
                          <div className="font-medium">{job.experience_level}</div>
                        </div>
                        {job.salary_range && (
                          <div>
                            <span className="text-muted-foreground">Salary:</span>
                            <div className="font-medium text-primary">{job.salary_range}</div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-foreground leading-relaxed line-clamp-3">{job.description}</p>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          <div>Posted: {formatDate(job.created_at)}</div>
                          <div>{job.applications_count || 0} applications</div>
                        </div>
                        {user ? (
                          job.has_applied ? (
                            <Button variant="outline" disabled>
                              <CheckCircle className="mr-2 h-4 w-4" /> Applied
                            </Button>
                          ) : (
                            <Button onClick={() => openApplyDialog(job.id)}>Apply Now</Button>
                          )
                        ) : (
                          <Button variant="outline" onClick={() => toast({ title: "Login Required", description: "Please login to apply" })}>
                            Apply Now
                          </Button>
                        )}
                      </div>
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
                    <Plus className="mr-2 h-4 w-4" /> Post New Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Post New Job</DialogTitle>
                    <DialogDescription>Create a new job listing for the community.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input id="title" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="Software Engineer" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="company">Company *</Label>
                        <Input id="company" value={newJob.company} onChange={(e) => setNewJob({...newJob, company: e.target.value})} placeholder="Company Name" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="City, Country" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="salary">Salary Range</Label>
                        <Input id="salary" value={newJob.salary_range} onChange={(e) => setNewJob({...newJob, salary_range: e.target.value})} placeholder="₹8-12 LPA" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="job_type">Job Type</Label>
                        <Select value={newJob.job_type} onValueChange={(value) => setNewJob({...newJob, job_type: value})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select value={newJob.experience_level} onValueChange={(value) => setNewJob({...newJob, experience_level: value})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="mid">Mid Level</SelectItem>
                            <SelectItem value="senior">Senior Level</SelectItem>
                            <SelectItem value="lead">Lead/Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} placeholder="Job description" rows={3} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="requirements">Requirements</Label>
                      <Textarea id="requirements" value={newJob.requirements} onChange={(e) => setNewJob({...newJob, requirements: e.target.value})} placeholder="Job requirements" rows={2} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateJob}>Post Job</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Job</DialogTitle>
            <DialogDescription>Submit your application for this position.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
              <Textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're a great fit for this role..."
                rows={5}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApply}>Submit Application</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Job;
