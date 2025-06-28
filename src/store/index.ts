
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import celebritySlice from './slices/celebritySlice';
import outfitSlice from './slices/outfitSlice';
import blogSlice from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    celebrities: celebritySlice,
    outfits: outfitSlice,
    blogs: blogSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
