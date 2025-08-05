import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  
  const [familyMembers] = useState<FamilyMember[]>([
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

  const filteredMembers = familyMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRelationColor = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'head of family': return 'bg-primary text-primary-foreground';
      case 'spouse': return 'bg-secondary text-secondary-foreground';
      case 'son': case 'daughter': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
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
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search family members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md mx-auto"
            />
          </div>

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
              <Button
                size="lg"
                onClick={() => toast({
                  title: "Add Family Member",
                  description: "This feature will be available soon!",
                })}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Family Member
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Family;