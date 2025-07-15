
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/data';
import { API_ENDPOINTS } from '@/config/api';
import axios from 'axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunk for login using your backend API
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    console.log("email:", email);
    console.log("password:", password);
    const payload = { "email": email, "password": password }
    try {
      const response = await axios.post(
        API_ENDPOINTS.admin.login,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("response:", response)
      const data = response.data;
      
      const userData: User = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email,
        name: data.user?.name || data.name || 'Admin User',
        role: data.user?.role || data.role || 'admin',
        password: '',
        lastLogin: new Date().toISOString(),
      };

      localStorage.setItem('adminUser', JSON.stringify(userData));
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      return userData;
    } catch (error: any) {
      console.log("error:", error)
      const message =
        error.response?.data?.message ||
        `Login failed: ${error.response?.status || error.message}`;
      throw new Error(message);
    }
  }
);

// Async thunk for logout
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    // Clear local storage
    localStorage.removeItem('adminUser');
    localStorage.removeItem('authToken');

    // If your backend has a logout endpoint, you can call it here
    // try {
    //   await fetch(`${API_CONFIG.baseUrl}/admin/logout`, {
    //     method: 'POST',
    //     credentials: 'include',
    //   });
    // } catch (error) {
    //   console.error('Logout API call failed:', error);
    // }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
