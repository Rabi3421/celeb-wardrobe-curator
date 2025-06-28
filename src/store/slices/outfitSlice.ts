
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Outfit } from '@/types/data';
import { fetchOutfits } from '@/services/api';

interface OutfitState {
  outfits: Outfit[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OutfitState = {
  outfits: [],
  isLoading: false,
  error: null,
};

export const fetchOutfitsAsync = createAsyncThunk(
  'outfits/fetchOutfits',
  async ({ limit, celebrityId }: { limit?: number; celebrityId?: string } = {}) => {
    const outfits = await fetchOutfits(limit, celebrityId);
    return outfits;
  }
);

const outfitSlice = createSlice({
  name: 'outfits',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutfitsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOutfitsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.outfits = action.payload;
      })
      .addCase(fetchOutfitsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch outfits';
      });
  },
});

export const { clearError } = outfitSlice.actions;
export default outfitSlice.reducer;
