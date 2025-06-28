
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Celebrity } from '@/types/data';
import { fetchCelebrities } from '@/services/api';

interface CelebrityState {
  celebrities: Celebrity[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CelebrityState = {
  celebrities: [],
  isLoading: false,
  error: null,
};

export const fetchCelebritiesAsync = createAsyncThunk(
  'celebrities/fetchCelebrities',
  async () => {
    const celebrities = await fetchCelebrities();
    return celebrities;
  }
);

const celebritySlice = createSlice({
  name: 'celebrities',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
      })
      .addCase(fetchCelebritiesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch celebrities';
      });
  },
});

export const { clearError } = celebritySlice.actions;
export default celebritySlice.reducer;
