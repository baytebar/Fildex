import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';

// Async thunks for admin API calls
export const adminLogin = createAsyncThunk(
  'admin/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.admin.login(credentials);
      // Store admin token in localStorage
      if (response.data?.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminEmail', credentials.identifier); // Use identifier instead of email
        localStorage.setItem('isAdminLoggedIn', 'true');
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.admin.getAllUsers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserById = createAsyncThunk(
  'admin/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.admin.getUserById(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllInterestRoles = createAsyncThunk(
  'admin/getAllInterestRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.admin.getAllInterestRoles();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInterestRole = createAsyncThunk(
  'admin/createInterestRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await api.admin.createInterestRole(roleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInterestRole = createAsyncThunk(
  'admin/updateInterestRole',
  async ({ id, roleData }, { rejectWithValue }) => {
    try {
      const response = await api.admin.updateInterestRole(id, roleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInterestRole = createAsyncThunk(
  'admin/deleteInterestRole',
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await api.admin.deleteInterestRole(roleId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // Authentication
  admin: null,
  token: localStorage.getItem('adminToken'),
  isAuthenticated: !!localStorage.getItem('adminToken'),
  
  // Data
  users: {
    data: [],
    totalUsers: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
    isLoading: false,
    error: null
  },
  
  interestRoles: {
    data: [],
    isLoading: false,
    error: null
  },
  
  // UI State
  isLoading: false,
  error: null,
};

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('isAdminLoggedIn');
    },
    clearError: (state) => {
      state.error = null;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
    },
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      const user = state.users.data.find(u => u._id === userId);
      if (user) {
        user.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.data;
        state.token = action.payload.data?.token;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.users.isLoading = true;
        state.users.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users.isLoading = false;
        state.users.data = action.payload.data.users;
        state.users.totalUsers = action.payload.data.totalUsers;
        state.users.currentPage = action.payload.data.currentPage;
        state.users.totalPages = action.payload.data.totalPages;
        state.users.limit = action.payload.data.limit;
        state.users.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.users.isLoading = false;
        state.users.error = action.payload;
      })
      
      // Get User By ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get All Interest Roles
      .addCase(getAllInterestRoles.pending, (state) => {
        state.interestRoles.isLoading = true;
        state.interestRoles.error = null;
      })
      .addCase(getAllInterestRoles.fulfilled, (state, action) => {
        state.interestRoles.isLoading = false;
        state.interestRoles.data = action.payload.data;
        state.interestRoles.error = null;
      })
      .addCase(getAllInterestRoles.rejected, (state, action) => {
        state.interestRoles.isLoading = false;
        state.interestRoles.error = action.payload;
      })
      
      // Create Interest Role
      .addCase(createInterestRole.pending, (state) => {
        state.interestRoles.isLoading = true;
        state.interestRoles.error = null;
      })
      .addCase(createInterestRole.fulfilled, (state, action) => {
        state.interestRoles.isLoading = false;
        state.interestRoles.data.push(action.payload.data);
        state.interestRoles.error = null;
      })
      .addCase(createInterestRole.rejected, (state, action) => {
        state.interestRoles.isLoading = false;
        state.interestRoles.error = action.payload;
      })
      
      // Update Interest Role
      .addCase(updateInterestRole.pending, (state) => {
        state.interestRoles.isLoading = true;
        state.interestRoles.error = null;
      })
      .addCase(updateInterestRole.fulfilled, (state, action) => {
        state.interestRoles.isLoading = false;
        const index = state.interestRoles.data.findIndex(role => role._id === action.payload.data._id);
        if (index !== -1) {
          state.interestRoles.data[index] = action.payload.data;
        }
        state.interestRoles.error = null;
      })
      .addCase(updateInterestRole.rejected, (state, action) => {
        state.interestRoles.isLoading = false;
        state.interestRoles.error = action.payload;
      })
      
      // Delete Interest Role
      .addCase(deleteInterestRole.pending, (state) => {
        state.interestRoles.isLoading = true;
        state.interestRoles.error = null;
      })
      .addCase(deleteInterestRole.fulfilled, (state, action) => {
        state.interestRoles.isLoading = false;
        state.interestRoles.data = state.interestRoles.data.filter(role => role._id !== action.payload.data._id);
        state.interestRoles.error = null;
      })
      .addCase(deleteInterestRole.rejected, (state, action) => {
        state.interestRoles.isLoading = false;
        state.interestRoles.error = action.payload;
      });
  },
});

export const { adminLogout, clearError, setAdmin, updateUserStatus } = adminSlice.actions;
export default adminSlice.reducer;
