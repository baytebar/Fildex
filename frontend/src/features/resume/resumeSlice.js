import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';

// Async thunk for resume upload
export const uploadResume = createAsyncThunk(
  'resume/uploadResume',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.public.uploadResume(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching all resumes (admin only)
export const fetchAllResumes = createAsyncThunk(
  'resume/fetchAllResumes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.admin.getAllResumes(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a resume (admin only)
export const deleteResume = createAsyncThunk(
  'resume/deleteResume',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await api.admin.deleteResume(resumeId);
      return { ...response, resumeId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,
  uploadStatus: null, // 'uploading', 'success', 'error'
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalResumes: 0,
    limit: 10,
  },
};

// Resume slice
const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUploadStatus: (state, action) => {
      state.uploadStatus = action.payload;
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Resume
      .addCase(uploadResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadStatus = 'uploading';
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadStatus = 'success';
        state.error = null;
        state.currentResume = action.payload.data;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.isLoading = false;
        state.uploadStatus = 'error';
        state.error = action.payload;
      })
      // Fetch All Resumes
      .addCase(fetchAllResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload.data.resumes;
        state.pagination = {
          currentPage: action.payload.data.currentPage,
          totalPages: action.payload.data.totalPages,
          totalResumes: action.payload.data.totalResumes,
          limit: action.payload.data.limit,
        };
      })
      .addCase(fetchAllResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Resume
      .addCase(deleteResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted resume from the list
        state.resumes = state.resumes.filter(resume => resume._id !== action.payload.resumeId);
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setUploadStatus, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;