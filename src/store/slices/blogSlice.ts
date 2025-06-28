
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BlogPost } from '@/types/data';
import { fetchBlogPosts } from '@/services/api';

interface BlogState {
  blogPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogPosts: [],
  isLoading: false,
  error: null,
};

export const fetchBlogPostsAsync = createAsyncThunk(
  'blogs/fetchBlogPosts',
  async ({ limit, categoryFilter }: { limit?: number; categoryFilter?: string } = {}) => {
    const blogPosts = await fetchBlogPosts(limit, categoryFilter);
    return blogPosts;
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
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
      })
      .addCase(fetchBlogPostsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch blog posts';
      });
  },
});

export const { clearError } = blogSlice.actions;
export default blogSlice.reducer;
