import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import videosReducer from './slices/videosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 