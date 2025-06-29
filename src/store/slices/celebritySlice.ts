
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Celebrity } from '@/types/data';
import { supabase } from '@/integrations/supabase/client';

interface CelebrityState {
  celebrities: Celebrity[];
  selectedCelebrity: Celebrity | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CelebrityState = {
  celebrities: [],
  selectedCelebrity: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching celebrities
export const fetchCelebritiesAsync = createAsyncThunk(
  'celebrities/fetchCelebrities',
  async () => {
    const { data, error } = await supabase
      .from('celebrities')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Convert database fields to match Celebrity type
    const formattedData: Celebrity[] = data.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      outfitCount: item.outfitcount || 0,
      bio: item.bio,
      category: item.category,
      styleType: item.style_type,
      slug: item.slug || item.id,
      birthdate: item.birthdate,
      birthplace: item.birthplace,
      height: item.height,
      education: item.education,
      careerHighlights: item.career_highlights,
      personalLife: item.personal_life,
      awards: item.awards,
      socialMedia: typeof item.social_media === 'string' ? 
        JSON.parse(item.social_media) : item.social_media,
      interestingFacts: item.interesting_facts,
      nationality: item.nationality,
      languages: item.languages,
      netWorth: item.net_worth,
      zodiacSign: item.zodiac_sign,
      philanthropyWork: item.philanthropy_work,
      businessVentures: item.business_ventures,
      controversies: item.controversies,
      fanbaseNickname: item.fanbase_nickname,
      signature: typeof item.signature === 'string' ? 
        JSON.parse(item.signature) : item.signature,
      measurements: item.measurements,
      dietFitness: item.diet_fitness,
      styleEvolution: item.style_evolution,
      influences: item.influences,
      quotes: item.quotes,
      publicPerception: item.public_perception,
      brandEndorsements: item.brand_endorsements
    }));
    
    return formattedData;
  }
);

// Async thunk for deleting celebrity
export const deleteCelebrityAsync = createAsyncThunk(
  'celebrities/deleteCelebrity',
  async (id: string) => {
    const { error } = await supabase
      .from('celebrities')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return id;
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
      .addCase(deleteCelebrityAsync.fulfilled, (state, action) => {
        state.celebrities = state.celebrities.filter(
          celebrity => celebrity.id !== action.payload
        );
      });
  },
});

export const { setSelectedCelebrity, clearError } = celebritySlice.actions;
export default celebritySlice.reducer;
