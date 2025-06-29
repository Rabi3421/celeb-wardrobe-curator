
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import celebrityReducer from './slices/celebritySlice';
import outfitReducer from './slices/outfitSlice';
import blogReducer from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    celebrities: celebrityReducer,
    outfits: outfitReducer,
    blog: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
