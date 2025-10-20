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

export const getAllJobTitles = createAsyncThunk(
  'admin/getAllJobTitles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.admin.getAllJobTitles();
      return response;
    } catch (error) {
      toast.error('Failed to load job titles: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const createJobTitle = createAsyncThunk(
  'admin/createJobTitle',
  async (jobTitleData, { rejectWithValue }) => {
    try {
      const response = await api.admin.createJobTitle(jobTitleData);
      toast.success('Job title created successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to create job title: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const updateJobTitle = createAsyncThunk(
  'admin/updateJobTitle',
  async ({ id, jobTitleData }, { rejectWithValue }) => {
    try {
      const response = await api.admin.updateJobTitle(id, jobTitleData);
      toast.success('Job title updated successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to update job title: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJobTitle = createAsyncThunk(
  'admin/deleteJobTitle',
  async (jobTitleId, { rejectWithValue }) => {
    try {
      const response = await api.admin.deleteJobTitle(jobTitleId);
      toast.success('Job title paused successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to pause job title: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const resumeJobTitle = createAsyncThunk(
  'admin/resumeJobTitle',
  async (jobTitleId, { rejectWithValue }) => {
    try {
      const response = await api.admin.resumeJobTitle(jobTitleId);
      toast.success('Job title resumed successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to resume job title: ' + (error.message || 'Please try again'));
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

// Job Postings
export const getAllJobPostings = createAsyncThunk(
  'admin/getAllJobPostings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.admin.getAllJobPostings(params);
      return response;
    } catch (error) {
      toast.error('Failed to load job postings: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const getJobPostingById = createAsyncThunk(
  'admin/getJobPostingById',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.admin.getJobPostingById(jobId);
      return response;
    } catch (error) {
      toast.error('Failed to load job posting: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const createJobPosting = createAsyncThunk(
  'admin/createJobPosting',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await api.admin.createJobPosting(jobData);
      toast.success('Job posting created successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to create job posting: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const updateJobPosting = createAsyncThunk(
  'admin/updateJobPosting',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await api.admin.updateJobPosting(jobId, jobData);
      toast.success('Job posting updated successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to update job posting: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJobPosting = createAsyncThunk(
  'admin/deleteJobPosting',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.admin.deleteJobPosting(jobId);
      toast.success('Job posting deleted successfully!');
      return { jobId, response };
    } catch (error) {
      toast.error('Failed to delete job posting: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

// Departments
export const getAllDepartments = createAsyncThunk(
  'admin/getAllDepartments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.admin.getAllDepartments(params);
      return response;
    } catch (error) {
      toast.error('Failed to load departments: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  'admin/createDepartment',
  async (deptData, { rejectWithValue }) => {
    try {
      const response = await api.admin.createDepartment(deptData);
      toast.success('Department created successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to create department: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'admin/updateDepartment',
  async ({ deptId, deptData }, { rejectWithValue }) => {
    try {
      const response = await api.admin.updateDepartment(deptId, deptData);
      toast.success('Department updated successfully!');
      return response;
    } catch (error) {
      toast.error('Failed to update department: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'admin/deleteDepartment',
  async (deptId, { rejectWithValue }) => {
    try {
      const response = await api.admin.deleteDepartment(deptId);
      toast.success('Department deleted successfully!');
      return { deptId, response };
    } catch (error) {
      toast.error('Failed to delete department: ' + (error.message || 'Please try again'));
      return rejectWithValue(error.message);
    }
  }
);

// Admins
export const getAllAdmins = createAsyncThunk(
  'admin/getAllAdmins',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.admin.getAllAdmins(params);
      return response;
    } catch (error) {
      toast.error('Failed to load admins: ' + (error.message || 'Please try again'));
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
  
  jobTitles: {
    data: [],
    isLoading: false,
    error: null
  },
  
  jobPostings: {
    data: [],
    totalJobs: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
    isLoading: false,
    error: null
  },
  
  departments: {
    data: [],
    isLoading: false,
    error: null
  },
  
  admins: {
    data: [],
    totalAdmins: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
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
      .addCase(getAllJobTitles.pending, (state) => {
        state.jobTitles.isLoading = true;
        state.jobTitles.error = null;
      })
      .addCase(getAllJobTitles.fulfilled, (state, action) => {
        state.jobTitles.isLoading = false;
        // Handle paginated response from backend or empty response (204)
        if (action.payload && action.payload.data) {
          state.jobTitles.data = Array.isArray(action.payload.data) 
            ? action.payload.data 
            : (action.payload.data.jobTitles || []);
        } else {
          // Handle 204 No Content response - no job titles exist
          state.jobTitles.data = [];
        }
        state.jobTitles.error = null;
      })
      .addCase(getAllJobTitles.rejected, (state, action) => {
        state.jobTitles.isLoading = false;
        state.jobTitles.error = action.payload;
      })
      
      // Create Interest Role
      .addCase(createJobTitle.pending, (state) => {
        state.jobTitles.isLoading = true;
        state.jobTitles.error = null;
      })
      .addCase(createJobTitle.fulfilled, (state, action) => {
        state.jobTitles.isLoading = false;
        if (action.payload && action.payload.data) {
          state.jobTitles.data.push(action.payload.data);
        }
        state.jobTitles.error = null;
      })
      .addCase(createJobTitle.rejected, (state, action) => {
        state.jobTitles.isLoading = false;
        state.jobTitles.error = action.payload;
      })
      
      // Update Interest Role
      .addCase(updateJobTitle.pending, (state) => {
        state.jobTitles.isLoading = true;
        state.jobTitles.error = null;
      })
      .addCase(updateJobTitle.fulfilled, (state, action) => {
        state.jobTitles.isLoading = false;
        const index = state.jobTitles.data.findIndex(role => role._id === action.payload.data._id);
        if (index !== -1) {
          state.jobTitles.data[index] = action.payload.data;
        }
        state.jobTitles.error = null;
      })
      .addCase(updateJobTitle.rejected, (state, action) => {
        state.jobTitles.isLoading = false;
        state.jobTitles.error = action.payload;
      })
      
      // Delete Interest Role
      .addCase(deleteJobTitle.pending, (state) => {
        state.jobTitles.isLoading = true;
        state.jobTitles.error = null;
      })
      .addCase(deleteJobTitle.fulfilled, (state, action) => {
        state.jobTitles.isLoading = false;
        // Update the job title to mark it as deleted (soft delete)
        const index = state.jobTitles.data.findIndex(role => role._id === action.payload.data._id);
        if (index !== -1) {
          state.jobTitles.data[index].isDeleted = true;
        }
        state.jobTitles.error = null;
      })
      .addCase(deleteJobTitle.rejected, (state, action) => {
        state.jobTitles.isLoading = false;
        state.jobTitles.error = action.payload;
      })
      
      // Resume Job Title
      .addCase(resumeJobTitle.pending, (state) => {
        state.jobTitles.isLoading = true;
        state.jobTitles.error = null;
      })
      .addCase(resumeJobTitle.fulfilled, (state, action) => {
        state.jobTitles.isLoading = false;
        // Update the job title to mark it as active (unpause)
        const index = state.jobTitles.data.findIndex(role => role._id === action.payload.data._id);
        if (index !== -1) {
          state.jobTitles.data[index].isDeleted = false;
        }
        state.jobTitles.error = null;
      })
      .addCase(resumeJobTitle.rejected, (state, action) => {
        state.jobTitles.isLoading = false;
        state.jobTitles.error = action.payload;
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
      })
      
      // Job Postings
      .addCase(getAllJobPostings.pending, (state) => {
        state.jobPostings.isLoading = true;
        state.jobPostings.error = null;
      })
      .addCase(getAllJobPostings.fulfilled, (state, action) => {
        state.jobPostings.isLoading = false;
        state.jobPostings.data = action.payload.data?.jobs || [];
        state.jobPostings.totalJobs = action.payload.data?.pagination?.totalJobs || 0;
        state.jobPostings.error = null;
      })
      .addCase(getAllJobPostings.rejected, (state, action) => {
        state.jobPostings.isLoading = false;
        state.jobPostings.error = action.payload;
      })
      
      .addCase(createJobPosting.pending, (state) => {
        state.jobPostings.isLoading = true;
        state.jobPostings.error = null;
      })
      .addCase(createJobPosting.fulfilled, (state, action) => {
        state.jobPostings.isLoading = false;
        state.jobPostings.data.unshift(action.payload.data);
        state.jobPostings.totalJobs += 1;
        state.jobPostings.error = null;
      })
      .addCase(createJobPosting.rejected, (state, action) => {
        state.jobPostings.isLoading = false;
        state.jobPostings.error = action.payload;
      })
      
      .addCase(updateJobPosting.pending, (state) => {
        state.jobPostings.isLoading = true;
        state.jobPostings.error = null;
      })
      .addCase(updateJobPosting.fulfilled, (state, action) => {
        state.jobPostings.isLoading = false;
        const index = state.jobPostings.data.findIndex(job => job._id === action.payload.data._id);
        if (index !== -1) {
          state.jobPostings.data[index] = action.payload.data;
        }
        state.jobPostings.error = null;
      })
      .addCase(updateJobPosting.rejected, (state, action) => {
        state.jobPostings.isLoading = false;
        state.jobPostings.error = action.payload;
      })
      
      .addCase(deleteJobPosting.pending, (state) => {
        state.jobPostings.isLoading = true;
        state.jobPostings.error = null;
      })
      .addCase(deleteJobPosting.fulfilled, (state, action) => {
        state.jobPostings.isLoading = false;
        state.jobPostings.data = state.jobPostings.data.filter(job => job._id !== action.payload.jobId);
        state.jobPostings.totalJobs -= 1;
        state.jobPostings.error = null;
      })
      .addCase(deleteJobPosting.rejected, (state, action) => {
        state.jobPostings.isLoading = false;
        state.jobPostings.error = action.payload;
      })
      
      // Departments
      .addCase(getAllDepartments.pending, (state) => {
        state.departments.isLoading = true;
        state.departments.error = null;
      })
      .addCase(getAllDepartments.fulfilled, (state, action) => {
        state.departments.isLoading = false;
        state.departments.data = action.payload.data?.departments || [];
        state.departments.error = null;
      })
      .addCase(getAllDepartments.rejected, (state, action) => {
        state.departments.isLoading = false;
        state.departments.error = action.payload;
      })
      
      .addCase(createDepartment.pending, (state) => {
        state.departments.isLoading = true;
        state.departments.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.isLoading = false;
        state.departments.data.push(action.payload.data);
        state.departments.error = null;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.departments.isLoading = false;
        state.departments.error = action.payload;
      })
      
      .addCase(updateDepartment.pending, (state) => {
        state.departments.isLoading = true;
        state.departments.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.departments.isLoading = false;
        const index = state.departments.data.findIndex(dept => dept._id === action.payload.data._id);
        if (index !== -1) {
          state.departments.data[index] = action.payload.data;
        }
        state.departments.error = null;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.departments.isLoading = false;
        state.departments.error = action.payload;
      })
      
      .addCase(deleteDepartment.pending, (state) => {
        state.departments.isLoading = true;
        state.departments.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments.isLoading = false;
        state.departments.data = state.departments.data.filter(dept => dept._id !== action.payload.deptId);
        state.departments.error = null;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.departments.isLoading = false;
        state.departments.error = action.payload;
      })
      
      // Admins
      .addCase(getAllAdmins.pending, (state) => {
        state.admins.isLoading = true;
        state.admins.error = null;
      })
      .addCase(getAllAdmins.fulfilled, (state, action) => {
        state.admins.isLoading = false;
        state.admins.data = action.payload.data?.admins || [];
        state.admins.totalAdmins = action.payload.data?.pagination?.total || 0;
        state.admins.currentPage = action.payload.data?.pagination?.page || 1;
        state.admins.totalPages = action.payload.data?.pagination?.pages || 0;
        state.admins.limit = action.payload.data?.pagination?.limit || 10;
        state.admins.error = null;
      })
      .addCase(getAllAdmins.rejected, (state, action) => {
        state.admins.isLoading = false;
        state.admins.error = action.payload;
      });
  },
});

export const { adminLogout, clearError, setAdmin, restoreAdminAuth } = adminSlice.actions;
export default adminSlice.reducer;