
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/data';
import { API_ENDPOINTS } from '@/config/api';

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
    const response = await fetch(API_ENDPOINTS.admin.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies if your API uses them
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Assuming your API returns user data and possibly a token
    const userData: User = {
      id: data.user?.id || data.id,
      email: data.user?.email || data.email,
      name: data.user?.name || data.name || 'Admin User',
      role: data.user?.role || data.role || 'admin',
      password: '',
      lastLogin: new Date().toISOString()
    };
    
    // Store user data and token (if provided) in localStorage
    localStorage.setItem('adminUser', JSON.stringify(userData));
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return userData;
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
