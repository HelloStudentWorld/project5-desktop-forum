import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await api.get('/posts');
    return response.data;
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId) => {
    await api.delete(`/posts/${postId}`);
    return postId;
  }
);

const initialState = {
  list: [],
  currentPost: null,
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch single post
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(post =>
          post.id === action.payload.id ? action.payload : post
        );
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(post => post.id !== action.payload);
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentPost, clearError } = postsSlice.actions;
export default postsSlice.reducer;