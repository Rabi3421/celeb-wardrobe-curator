
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BlogPost } from '@/types/data';
import { supabase } from '@/integrations/supabase/client';

interface BlogState {
  blogPosts: BlogPost[];
  selectedPost: BlogPost | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogPosts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching blog posts
export const fetchBlogPostsAsync = createAsyncThunk(
  'blog/fetchBlogPosts',
  async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(post => ({
      id: post.id,
      title: post.title,
      image: post.image,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      date: post.date,
      created_at: post.created_at,
      updated_at: post.updated_at,
      slug: post.slug || '',
      meta_description: post.meta_description || '',
      structured_data: post.structured_data || '',
      keywords: post.keywords || ''
    }));
  }
);

// Async thunk for deleting blog post
export const deleteBlogPostAsync = createAsyncThunk(
  'blog/deleteBlogPost',
  async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return id;
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setSelectedPost: (state, action: PayloadAction<BlogPost | null>) => {
      state.selectedPost = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPostsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogPostsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogPosts = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogPostsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch blog posts';
      })
      .addCase(deleteBlogPostAsync.fulfilled, (state, action) => {
        state.blogPosts = state.blogPosts.filter(
          post => post.id !== action.payload
        );
      });
  },
});

export const { setSelectedPost, clearError } = blogSlice.actions;
export default blogSlice.reducer;
