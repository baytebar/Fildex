import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import { toast } from 'sonner';

export const adminLogin = createAsyncThunk(
  'admin/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.admin.login(credentials);
      if (response.data?.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminEmail', credentials.identifier);
        localStorage.setItem('isAdminLoggedIn', 'true');
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const adminRegister = createAsyncThunk(
  'admin/adminRegister',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await api.admin.register(adminData);
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
      toast.error('Failed to load users: ' + (error.message || 'Please try again'));
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
      toast.error('Failed to load user: ' + (error.message || 'Please try again'));
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
      toast.error('Failed to load roles: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const createInterestRole = createAsyncThunk(
  'admin/createInterestRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await api.admin.createInterestRole(roleData);
      toast.success('Role created successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to create role: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const updateInterestRole = createAsyncThunk(
  'admin/updateInterestRole',
  async ({ id, roleData }, { rejectWithValue }) => {
    try {
      const response = await api.admin.updateInterestRole(id, roleData);
      toast.success('Role updated successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to update role: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInterestRole = createAsyncThunk(
  'admin/deleteInterestRole',
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await api.admin.deleteInterestRole(roleId);
      toast.success('Role deleted successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to delete role: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await api.admin.updateUserStatus(userId, status);
      toast.success('User status updated successfully!');
      return { userId, status, user: response.data };
    } catch (error) {
      toast.error('Failed to update user status: ' + (error.message || 'Please try again'));
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
      toast.success('Admin logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.token = action.payload?.token || state.token;
      state.isAuthenticated = true;
    },
    restoreAdminAuth: (state) => {
      const token = localStorage.getItem('adminToken');
      const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
      if (token && isAdminLoggedIn) {
        state.token = token;
        state.isAuthenticated = true;
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
      
      // Admin Registration
      .addCase(adminRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Registration successful, but not automatically logged in
        // The user needs to log in after registration
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.isLoading = false;
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
      })
      
      // Update User Status
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { userId, status, user } = action.payload;
        const userIndex = state.users.data.findIndex(u => u._id === userId);
        if (userIndex !== -1) {
          state.users.data[userIndex] = { ...state.users.data[userIndex], status };
        }
        state.error = null;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout, clearError, setAdmin, restoreAdminAuth } = adminSlice.actions;
export default adminSlice.reducer;