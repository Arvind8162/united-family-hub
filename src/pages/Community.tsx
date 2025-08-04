import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityPost {
  id: number;
  author: string;
  avatar: string;
  content: string;
  category: 'announcement' | 'discussion' | 'question' | 'celebration';
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface CommunityGroup {
  id: number;
  name: string;
  description: string;
  members: number;
  icon: string;
  category: string;
}

const Community = () => {
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 1,
      author: 'Rajesh Patel',
      avatar: 'RP',
      content: 'Excited to announce our upcoming Diwali celebration! We need volunteers for decoration and organizing. Please reach out if you can help make this event special for our community.',
      category: 'announcement',
      timestamp: '2025-01-30T10:30:00Z',
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: 2,
      author: 'Priya Sharma',
      avatar: 'PS',
      content: 'Has anyone tried the new Indian restaurant near the community center? Looking for recommendations for our family dinner this weekend.',
      category: 'question',
      timestamp: '2025-01-30T09:15:00Z',
      likes: 12,
      comments: 15,
      isLiked: true
    },
    {
      id: 3,
      author: 'Dr. Arjun Kumar',
      avatar: 'AK',
      content: 'Congratulations to all the students in our community who received scholarships this year! Your hard work and dedication inspire us all. 🎓',
      category: 'celebration',
      timestamp: '2025-01-29T16:45:00Z',
      likes: 45,
      comments: 12,
      isLiked: false
    },
    {
      id: 4,
      author: 'Kavya Singh',
      avatar: 'KS',
      content: 'What are your thoughts on organizing a monthly book club? We could meet at the community center and discuss books related to our culture and heritage.',
      category: 'discussion',
      timestamp: '2025-01-29T14:20:00Z',
      likes: 18,
      comments: 22,
      isLiked: true
    }
  ]);

  const [groups] = useState<CommunityGroup[]>([
    {
      id: 1,
      name: 'Events & Celebrations',
      description: 'Planning and organizing community events',
      members: 156,
      icon: 'fas fa-calendar-alt',
      category: 'Events'
    },
    {
      id: 2,
      name: 'Youth Connect',
      description: 'Platform for young community members',
      members: 89,
      icon: 'fas fa-users',
      category: 'Social'
    },
    {
      id: 3,
      name: 'Business Network',
      description: 'Professional networking and opportunities',
      members: 112,
      icon: 'fas fa-briefcase',
      category: 'Professional'
    },
    {
      id: 4,
      name: 'Cultural Heritage',
      description: 'Preserving and sharing our traditions',
      members: 203,
      icon: 'fas fa-landmark',
      category: 'Cultural'
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-primary text-primary-foreground';
      case 'discussion': return 'bg-secondary text-secondary-foreground';
      case 'question': return 'bg-accent text-accent-foreground';
      case 'celebration': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleComment = (postId: number) => {
    toast({
      title: "Comments",
      description: "Comment feature will be available soon!",
    });
  };

  const handleJoinGroup = (groupName: string) => {
    toast({
      title: "Joined Group",
      description: `You've joined "${groupName}" successfully!`,
    });
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Community Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect, share, and engage with your community members.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Community Groups Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Community Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groups.map((group) => (
                      <div key={group.id} className="border rounded-lg p-3 hover:bg-accent/10 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className={`${group.icon} text-primary`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">{group.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{group.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">{group.members} members</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleJoinGroup(group.name)}
                                className="text-xs"
                              >
                                Join
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => toast({
                          title: "Create Group",
                          description: "Group creation feature will be available soon!",
                        })}
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Create Group
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => toast({
                          title: "Moderate Posts",
                          description: "Post moderation feature will be available soon!",
                        })}
                      >
                        <i className="fas fa-shield-alt mr-2"></i>
                        Moderate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex space-x-3">
                    <Avatar>
                      <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-muted-foreground"
                      onClick={() => toast({
                        title: "Create Post",
                        description: "Post creation feature will be available soon!",
                      })}
                    >
                      What's on your mind?
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Community Posts */}
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{post.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{post.author}</h3>
                          <p className="text-sm text-muted-foreground">{formatTimestamp(post.timestamp)}</p>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed mb-4">{post.content}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={post.isLiked ? 'text-destructive' : 'text-muted-foreground'}
                        >
                          <i className={`${post.isLiked ? 'fas' : 'far'} fa-heart mr-2`}></i>
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleComment(post.id)}
                          className="text-muted-foreground"
                        >
                          <i className="far fa-comment mr-2"></i>
                          {post.comments}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <i className="fas fa-share mr-2"></i>
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;