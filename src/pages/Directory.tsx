import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Phone, Mail, MapPin, Briefcase, Users } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  profession: string | null;
  family_name: string | null;
  avatar_url: string | null;
}

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.family_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (member.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (member.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleCall = (phone: string) => {
    if (phone) window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    if (email) window.open(`mailto:${email}`, '_self');
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
          <h1 className="text-4xl font-bold text-primary mb-4">Community Directory</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with community members and find contact information.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name, family, profession, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4"
            />
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No members found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center overflow-hidden">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold">{member.full_name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-primary">{member.full_name}</CardTitle>
                      {member.family_name && (
                        <Badge variant="secondary" className="text-xs">
                          {member.family_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {member.profession && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{member.profession}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        <a href={`tel:${member.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                          {member.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors truncate">
                        {member.email}
                      </a>
                    </div>
                    {member.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{member.location}</span>
                      </div>
                    )}
                    <div className="pt-3 flex gap-2">
                      {member.phone && (
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleCall(member.phone!)}>
                          <Phone className="mr-1 h-4 w-4" /> Call
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEmail(member.email)}>
                        <Mail className="mr-1 h-4 w-4" /> Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
