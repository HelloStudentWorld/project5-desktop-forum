import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await api.get('/categories');
    return response.data;
  }
);

export const fetchCategoryPosts = createAsyncThunk(
  'categories/fetchCategoryPosts',
  async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  }
);

const initialState = {
  categories: [],
  currentCategory: null,
  status: 'idle',
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch category posts
      .addCase(fetchCategoryPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;