
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Outfit } from '@/types/data';
import { supabase } from '@/integrations/supabase/client';

interface OutfitState {
  outfits: Outfit[];
  selectedOutfit: Outfit | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OutfitState = {
  outfits: [],
  selectedOutfit: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching outfits
export const fetchOutfitsAsync = createAsyncThunk(
  'outfits/fetchOutfits',
  async () => {
    const { data, error } = await supabase
      .from('outfits')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Convert database fields to match Outfit type
    const formattedData: Outfit[] = data.map(item => ({
      id: item.id,
      title: item.title,
      celebrity: item.celebrity,
      image: item.image,
      category: item.category,
      occasion: item.occasion,
      tags: Array.isArray(item.tags) ? item.tags : 
        (typeof item.tags === 'string' ? JSON.parse(item.tags) : []),
      products: Array.isArray(item.products) ? item.products :
        (typeof item.products === 'string' ? JSON.parse(item.products) : []),
      description: item.description,
      price: item.price,
      slug: item.slug || item.id,
      date: item.date,
      likes: item.likes || 0,
      shares: item.shares || 0,
      styleNotes: item.style_notes,
      brandDetails: item.brand_details,
      availabilityStatus: item.availability_status,
      seasonality: item.seasonality,
      bodyType: item.body_type,
      colorPalette: item.color_palette,
      fabricCare: item.fabric_care,
      similarOutfits: item.similar_outfits
    }));
    
    return formattedData;
  }
);

// Async thunk for deleting outfit
export const deleteOutfitAsync = createAsyncThunk(
  'outfits/deleteOutfit',
  async (id: string) => {
    const { error } = await supabase
      .from('outfits')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return id;
  }
);

const outfitSlice = createSlice({
  name: 'outfits',
  initialState,
  reducers: {
    setSelectedOutfit: (state, action: PayloadAction<Outfit | null>) => {
      state.selectedOutfit = action.payload;
    },
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
        state.error = null;
      })
      .addCase(fetchOutfitsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch outfits';
      })
      .addCase(deleteOutfitAsync.fulfilled, (state, action) => {
        state.outfits = state.outfits.filter(
          outfit => outfit.id !== action.payload
        );
      });
  },
});

export const { setSelectedOutfit, clearError } = outfitSlice.actions;
export default outfitSlice.reducer;
