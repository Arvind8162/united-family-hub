import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface FamilyMember {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  profession: string;
  family: string;
}

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members] = useState<FamilyMember[]>([
    {
      id: 1,
      name: 'Rajesh Patel',
      phone: '+91-98765-43210',
      email: 'rajesh.patel@email.com',
      address: 'Mumbai, Maharashtra',
      profession: 'Engineer',
      family: 'Patel Family'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91-87654-32109',
      email: 'priya.sharma@email.com',
      address: 'Delhi, NCR',
      profession: 'Doctor',
      family: 'Sharma Family'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      phone: '+91-76543-21098',
      email: 'amit.kumar@email.com',
      address: 'Bangalore, Karnataka',
      profession: 'Software Developer',
      family: 'Kumar Family'
    },
    {
      id: 4,
      name: 'Sunita Verma',
      phone: '+91-65432-10987',
      email: 'sunita.verma@email.com',
      address: 'Pune, Maharashtra',
      profession: 'Teacher',
      family: 'Verma Family'
    }
  ]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Community Directory</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with community members and find contact information.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <Input
              type="text"
              placeholder="Search by name, family, or profession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-lg"></i>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-primary">{member.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {member.family}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <i className="fas fa-briefcase text-primary w-4"></i>
                    <span className="text-muted-foreground">{member.profession}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="fas fa-phone text-primary w-4"></i>
                    <a href={`tel:${member.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {member.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="fas fa-envelope text-primary w-4"></i>
                    <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors truncate">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="fas fa-map-marker-alt text-primary w-4"></i>
                    <span className="text-muted-foreground">{member.address}</span>
                  </div>
                  <div className="pt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <i className="fas fa-phone mr-1"></i>
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <i className="fas fa-envelope mr-1"></i>
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
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No members found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <i className="fas fa-user-plus mr-2"></i>
            Add New Member
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Directory;