import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import SearchFilter from '@/components/SearchFilter';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  phone: string;
  email: string;
  location: string;
  photo: string;
}

const Family = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelation, setFilterRelation] = useState('');
  const [familyMembers, setFamilyMembers] = useLocalStorage<FamilyMember[]>('familyMembers', [
    {
      id: 1,
      name: 'Rajesh Patel',
      relation: 'Head of Family',
      phone: '+91-98765-43210',
      email: 'rajesh.patel@email.com',
      location: 'Mumbai, India',
      photo: 'fas fa-user-circle'
    },
    {
      id: 2,
      name: 'Priya Patel',
      relation: 'Spouse',
      phone: '+91-98765-43211',
      email: 'priya.patel@email.com',
      location: 'Mumbai, India',
      photo: 'fas fa-user-circle'
    },
    {
      id: 3,
      name: 'Arjun Patel',
      relation: 'Son',
      phone: '+91-98765-43212',
      email: 'arjun.patel@email.com',
      location: 'Bangalore, India',
      photo: 'fas fa-user-circle'
    },
    {
      id: 4,
      name: 'Kavya Patel',
      relation: 'Daughter',
      phone: '+91-98765-43213',
      email: 'kavya.patel@email.com',
      location: 'Delhi, India',
      photo: 'fas fa-user-circle'
    },
    {
      id: 5,
      name: 'Ramesh Patel',
      relation: 'Uncle',
      phone: '+91-98765-43214',
      email: 'ramesh.patel@email.com',
      location: 'Ahmedabad, India',
      photo: 'fas fa-user-circle'
    },
    {
      id: 6,
      name: 'Sita Patel',
      relation: 'Aunt',
      phone: '+91-98765-43215',
      email: 'sita.patel@email.com',
      location: 'Pune, India',
      photo: 'fas fa-user-circle'
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; memberId: number | null }>({
    isOpen: false,
    memberId: null
  });
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
    location: ''
  });

  const relationOptions = [
    { value: 'Head of Family', label: 'Head of Family' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Uncle', label: 'Uncle' },
    { value: 'Aunt', label: 'Aunt' },
    { value: 'Cousin', label: 'Cousin' },
    { value: 'Grandparent', label: 'Grandparent' },
    { value: 'Other', label: 'Other' }
  ];

  const filteredMembers = familyMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRelation = !filterRelation || member.relation === filterRelation;
    return matchesSearch && matchesRelation;
  });

  const getRelationColor = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'head of family': return 'bg-primary text-primary-foreground';
      case 'spouse': return 'bg-secondary text-secondary-foreground';
      case 'son': case 'daughter': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relation || !newMember.phone || !newMember.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const member: FamilyMember = {
      id: Date.now(),
      ...newMember,
      photo: 'fas fa-user-circle'
    };

    setFamilyMembers(prev => [...prev, member]);
    setNewMember({ name: '', relation: '', phone: '', email: '', location: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Member Added",
      description: `${newMember.name} has been added to the family directory.`,
    });
  };

  const handleDeleteMember = (memberId: number) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
    setDeleteConfirm({ isOpen: false, memberId: null });
    
    toast({
      title: "Member Removed",
      description: "Family member has been removed from the directory.",
    });
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">My Family</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with your family members, view contact information, and stay in touch.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterValue={filterRelation}
            onFilterChange={setFilterRelation}
            filterOptions={relationOptions}
            placeholder="Search family members..."
            className="mb-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className={`${member.photo} text-3xl text-primary`}></i>
                  </div>
                  <CardTitle className="text-xl text-primary">{member.name}</CardTitle>
                  <Badge className={`${getRelationColor(member.relation)} w-fit mx-auto`}>
                    {member.relation}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <i className="fas fa-map-marker-alt text-primary w-4"></i>
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <i className="fas fa-phone text-primary w-4"></i>
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <i className="fas fa-envelope text-primary w-4"></i>
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(member.phone)}
                        className="flex-1"
                      >
                        <i className="fas fa-phone mr-2"></i>
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmail(member.email)}
                        className="flex-1"
                      >
                        <i className="fas fa-envelope mr-2"></i>
                        Email
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm({ isOpen: true, memberId: member.id })}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
              <p className="text-muted-foreground">No family members found matching your search.</p>
            </div>
          )}

          {isAdmin && (
            <div className="text-center mt-12">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <i className="fas fa-plus mr-2"></i>
                    Add Family Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Family Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relation">Relation *</Label>
                      <Select value={newMember.relation} onValueChange={(value) => setNewMember(prev => ({ ...prev, relation: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={newMember.phone}
                        onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91-98765-43210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newMember.location}
                        onChange={(e) => setNewMember(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddMember} className="flex-1">
                        Add Member
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={deleteConfirm.isOpen}
            onClose={() => setDeleteConfirm({ isOpen: false, memberId: null })}
            onConfirm={() => deleteConfirm.memberId && handleDeleteMember(deleteConfirm.memberId)}
            title="Remove Family Member"
            description="Are you sure you want to remove this family member from the directory? This action cannot be undone."
            confirmText="Remove"
            variant="destructive"
          />
        </div>
      </div>
    </div>
  );
};

export default Family;