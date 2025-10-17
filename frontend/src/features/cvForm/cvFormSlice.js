import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';

// Async thunk for CV upload
export const uploadCV = createAsyncThunk(
  'cvForm/uploadCV',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.user.uploadCV(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  cvData: [],
  isLoading: false,
  error: null,
  uploadStatus: null, // 'uploading', 'success', 'error'
};

// CV Form slice
const cvFormSlice = createSlice({
  name: 'cvForm',
  initialState,
  reducers: {
    addCV: (state, action) => {
      state.cvData.push(action.payload);
    },
    updateCV: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.cvData.findIndex(cv => cv.id === id);
      if (index !== -1) {
        state.cvData[index] = { ...state.cvData[index], ...updates };
      }
    },
    removeCV: (state, action) => {
      state.cvData = state.cvData.filter(cv => cv.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadStatus: (state, action) => {
      state.uploadStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload CV
      .addCase(uploadCV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadStatus = 'uploading';
      })
      .addCase(uploadCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadStatus = 'success';
        state.error = null;
        // Add the uploaded CV to the list
        if (action.payload.cv) {
          state.cvData.push(action.payload.cv);
        }
      })
      .addCase(uploadCV.rejected, (state, action) => {
        state.isLoading = false;
        state.uploadStatus = 'error';
        state.error = action.payload;
      });
  },
});

export const { addCV, updateCV, removeCV, clearError, setUploadStatus } = cvFormSlice.actions;
export default cvFormSlice.reducer;


