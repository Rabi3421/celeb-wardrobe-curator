import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Celebrity } from '@/types/data';

interface CelebrityState {
  celebrities: Celebrity[];
  selectedCelebrity: Celebrity | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: CelebrityState = {
  celebrities: [],
  selectedCelebrity: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

// Fetch all celebrities (no pagination)
export const fetchCelebritiesAsync = createAsyncThunk(
  'celebrities/fetchCelebrities',
  async () => {
    const response = await fetch('http://localhost:5000/api/celebrities');
    if (!response.ok) throw new Error('Failed to fetch celebrities');
    const data = await response.json();
    return data?.data;
  }
);

// Fetch celebrities with pagination
export const fetchCelebritiesPaginatedAsync = createAsyncThunk(
  'celebrities/fetchCelebritiesPaginated',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await fetch(`http://localhost:5000/api/celebrities?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch celebrities');
    const data = await response.json();
    // Assume API returns { data: Celebrity[], total: number }
    return data?.data;
  }
);

const celebritySlice = createSlice({
  name: 'celebrities',
  initialState,
  reducers: {
    setSelectedCelebrity: (state, action: PayloadAction<Celebrity | null>) => {
      state.selectedCelebrity = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCelebritiesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCelebritiesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.celebrities = action.payload;
        state.error = null;
      })
      .addCase(fetchCelebritiesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch celebrities';
      })
      .addCase(fetchCelebritiesPaginatedAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCelebritiesPaginatedAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.celebrities = action.payload.data;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchCelebritiesPaginatedAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch celebrities';
      });
  },
});

export const { setSelectedCelebrity, clearError, setPage, setLimit } = celebritySlice.actions;
export default celebritySlice.reducer;