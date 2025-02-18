import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import postsReducer from './posts/postsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
});