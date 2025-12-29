import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/NewAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { Loader2, Phone, Mail, MapPin, Plus, Edit, Trash2 } from 'lucide-react';

const Family = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const { familyMembers, loading, createFamilyMember, updateFamilyMember, deleteFamilyMember } = useFamilyMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
    location: '',
    photo_url: ''
  });

  const filteredMembers = familyMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const getRelationColor = (relation: string) => {
    const rel = relation.toLowerCase();
    if (rel.includes('head') || rel.includes('father') || rel.includes('mother')) return 'bg-primary text-primary-foreground';
    if (rel.includes('spouse') || rel.includes('wife') || rel.includes('husband')) return 'bg-secondary text-secondary-foreground';
    if (rel.includes('son') || rel.includes('daughter') || rel.includes('child')) return 'bg-accent text-accent-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const handleCall = (phone: string) => {
    if (phone) window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    if (email) window.open(`mailto:${email}`, '_self');
  };

  const resetForm = () => {
    setFormData({ name: '', relation: '', phone: '', email: '', location: '', photo_url: '' });
    setEditingMember(null);
  };

  const handleOpenDialog = (member?: any) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        relation: member.relation,
        phone: member.phone || '',
        email: member.email || '',
        location: member.location || '',
        photo_url: member.photo_url || ''
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.relation) {
      toast({ title: "Error", description: "Name and relation are required", variant: "destructive" });
      return;
    }

    try {
      if (editingMember) {
        await updateFamilyMember(editingMember.id, formData);
        toast({ title: "Success", description: "Family member updated successfully!" });
      } else {
        await createFamilyMember(formData);
        toast({ title: "Success", description: "Family member added successfully!" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save family member", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this family member?')) {
      try {
        await deleteFamilyMember(id);
        toast({ title: "Success", description: "Family member deleted successfully!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete family member", variant: "destructive" });
      }
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
          <h1 className="text-4xl font-bold text-primary mb-4">My Family</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with your family members, view contact information, and stay in touch.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search family members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md mx-auto"
            />
          </div>

          {filteredMembers.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No family members found.</p>
              {user && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Family Member
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {member.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl text-primary">{member.name}</CardTitle>
                    <Badge className={`${getRelationColor(member.relation)} w-fit mx-auto`}>
                      {member.relation}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {member.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{member.location}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {member.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      <div className="flex gap-2 pt-4">
                        {member.phone && (
                          <Button variant="outline" size="sm" onClick={() => handleCall(member.phone!)} className="flex-1">
                            <Phone className="mr-2 h-4 w-4" /> Call
                          </Button>
                        )}
                        {member.email && (
                          <Button variant="outline" size="sm" onClick={() => handleEmail(member.email!)} className="flex-1">
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </Button>
                        )}
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenDialog(member)} className="flex-1">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)} className="flex-1">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                  <Button size="lg" onClick={() => handleOpenDialog()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Family Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingMember ? 'Edit' : 'Add'} Family Member</DialogTitle>
                    <DialogDescription>
                      {editingMember ? 'Update family member details.' : 'Add a new family member to your directory.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="relation">Relation *</Label>
                      <Input id="relation" value={formData.relation} onChange={(e) => setFormData({...formData, relation: e.target.value})} placeholder="e.g., Father, Mother, Son" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91-XXXXX-XXXXX" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="City, Country" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>{editingMember ? 'Update' : 'Add'} Member</Button>
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

export default Family;
