import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Celebrity } from "@/types/data";
import axios from "axios";
import { API_CONFIG } from "../../config/api";

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
  "celebrities/fetchCelebrities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_CONFIG.baseUrl}/celebrities`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_CONFIG.websiteApiKey,
        },
      });
      // If your API returns { data: [...] }
      return response.data?.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch celebrities";
      return rejectWithValue(message);
    }
  }
);


export const deleteCelebrityAsync = createAsyncThunk(
  "celebrities/deleteCelebrity",
  async (celebrityId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/celebrities/${celebrityId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_CONFIG.websiteApiKey,
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }
      return celebrityId; // Return the deleted ID for reducer
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const celebritySlice = createSlice({
  name: "celebrities",
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
        state.celebrities = action.payload || [];
        state.error = null;
      })
      .addCase(fetchCelebritiesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch celebrities";
      })
      // .addCase(fetchCelebritiesPaginatedAsync.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(fetchCelebritiesPaginatedAsync.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   // If your API returns { data: [...], total: ... }
      //   state.celebrities = action.payload.data || [];
      //   state.total = action.payload.total || 0;
      //   state.error = null;
      // })
1      // .addCase(fetchCelebritiesPaginatedAsync.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.error.message || "Failed to fetch celebrities";
      // })
      // .addCase(deleteCelebrityAsync.fulfilled, (state, action) => {
      //   state.celebrities = state.celebrities.filter(
      //     (celeb) => celeb.id !== action.payload && celeb._id !== action.payload
      //   );
      // });
  },
});

export const { setSelectedCelebrity, clearError, setPage, setLimit } =
  celebritySlice.actions;

export default celebritySlice.reducer;
