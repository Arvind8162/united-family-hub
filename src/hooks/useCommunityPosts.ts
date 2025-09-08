import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { supabase } from '../integrations/supabase/client';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'discussion' | 'question' | 'celebration';
  images: string[] | null;
  author_id: string;
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  is_liked?: boolean;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

export const useCommunityPosts = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('community_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user likes for each post
      const postsWithLikes = await Promise.all(
        (data || []).map(async (post: any) => {
          let is_liked = false;
          if (user) {
            const { data: like } = await (supabase as any)
              .from('community_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single();
            is_liked = !!like;
          }

          return {
            ...post,
            is_liked
          };
        })
      );

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching community posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const createPost = async (postData: Omit<CommunityPost, 'id' | 'created_at' | 'updated_at' | 'author_id' | 'likes_count' | 'comments_count' | 'is_pinned'>) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { data, error } = await (supabase as any)
        .from('community_posts')
        .insert([{
          ...postData,
          author_id: user.id,
          likes_count: 0,
          comments_count: 0,
          is_pinned: false
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchPosts();
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const updatePost = async (id: string, postData: Partial<CommunityPost>) => {
    try {
      const { error } = await (supabase as any)
        .from('community_posts')
        .update(postData)
        .eq('id', id)
        .eq('author_id', user?.id);

      if (error) throw error;
      await fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('community_posts')
        .delete()
        .eq('id', id)
        .eq('author_id', user?.id);

      if (error) throw error;
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { data: existingLike } = await (supabase as any)
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await (supabase as any)
          .from('community_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        await (supabase as any)
          .from('community_posts')
          .update({ likes_count: (supabase as any).sql`likes_count - 1` })
          .eq('id', postId);
      } else {
        // Like
        await (supabase as any)
          .from('community_likes')
          .insert([{
            post_id: postId,
            user_id: user.id
          }]);

        await (supabase as any)
          .from('community_posts')
          .update({ likes_count: (supabase as any).sql`likes_count + 1` })
          .eq('id', postId);
      }

      await fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  };

  const createComment = async (postId: string, content: string) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const { data, error } = await (supabase as any)
        .from('community_comments')
        .insert([{
          post_id: postId,
          author_id: user.id,
          content
        }])
        .select()
        .single();

      if (error) throw error;

      // Update comment count
      await (supabase as any)
        .from('community_posts')
        .update({ comments_count: (supabase as any).sql`comments_count + 1` })
        .eq('id', postId);

      await fetchComments(postId);
      await fetchPosts();
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string, postId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('community_comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', user?.id);

      if (error) throw error;

      // Update comment count
      await (supabase as any)
        .from('community_posts')
        .update({ comments_count: (supabase as any).sql`comments_count - 1` })
        .eq('id', postId);

      await fetchComments(postId);
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return {
    posts,
    comments,
    loading,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    createComment,
    deleteComment,
    fetchComments,
    refresh: fetchPosts
  };
};