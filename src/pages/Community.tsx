import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/NewAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { Loader2, Heart, MessageCircle, Share2, Plus, Users } from 'lucide-react';

const Community = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const { posts, loading, createPost, toggleLike, createComment, fetchComments, comments } = useCommunityPosts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'discussion'
  });

  const groups = [
    { id: 1, name: 'Events & Celebrations', description: 'Planning and organizing community events', members: 156, icon: '📅' },
    { id: 2, name: 'Youth Connect', description: 'Platform for young community members', members: 89, icon: '👥' },
    { id: 3, name: 'Business Network', description: 'Professional networking and opportunities', members: 112, icon: '💼' },
    { id: 4, name: 'Cultural Heritage', description: 'Preserving and sharing our traditions', members: 203, icon: '🏛️' }
  ];

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

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({ title: "Error", description: "Please login to like posts", variant: "destructive" });
      return;
    }
    try {
      await toggleLike(postId);
    } catch (error) {
      toast({ title: "Error", description: "Failed to like post", variant: "destructive" });
    }
  };

  const handleOpenComments = async (postId: string) => {
    setSelectedPostId(postId);
    await fetchComments(postId);
    setCommentDialogOpen(true);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPostId) return;
    try {
      await createComment(selectedPostId, commentText);
      setCommentText('');
      toast({ title: "Success", description: "Comment added!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add comment", variant: "destructive" });
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    try {
      await createPost({ title: newPost.title, content: newPost.content, category: newPost.category as any });
      setNewPost({ title: '', content: '', category: 'discussion' });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Post created successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create post", variant: "destructive" });
    }
  };

  const handleJoinGroup = (groupName: string) => {
    toast({ title: "Joined Group", description: `You've joined "${groupName}" successfully!` });
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
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <Users className="h-5 w-5" /> Community Groups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groups.map((group) => (
                      <div key={group.id} className="border rounded-lg p-3 hover:bg-accent/10 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl">
                            {group.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">{group.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{group.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">{group.members} members</span>
                              <Button size="sm" variant="outline" onClick={() => handleJoinGroup(group.name)} className="text-xs">
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
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              {user && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 justify-start text-muted-foreground">
                            What's on your mind?
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Create Post</DialogTitle>
                            <DialogDescription>Share something with the community.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="title">Title *</Label>
                              <Input id="title" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} placeholder="Post title" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="category">Category</Label>
                              <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="discussion">Discussion</SelectItem>
                                  <SelectItem value="announcement">Announcement</SelectItem>
                                  <SelectItem value="question">Question</SelectItem>
                                  <SelectItem value="celebration">Celebration</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="content">Content *</Label>
                              <Textarea id="content" value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} placeholder="What's on your mind?" rows={4} />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreatePost}>Post</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Community Posts */}
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{post.title.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{post.title}</h3>
                            <p className="text-sm text-muted-foreground">{formatTimestamp(post.created_at)}</p>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
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
                            className={post.is_liked ? 'text-destructive' : 'text-muted-foreground'}
                          >
                            <Heart className={`mr-2 h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
                            {post.likes_count || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenComments(post.id)}
                            className="text-muted-foreground"
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {post.comments_count || 0}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Share2 className="mr-2 h-4 w-4" /> Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto space-y-3">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-3">
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(comment.created_at)}</p>
                </div>
              ))
            )}
          </div>
          {user && (
            <div className="flex gap-2 pt-4 border-t">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button onClick={handleAddComment}>Post</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
