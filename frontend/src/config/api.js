const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  USER: {
    REGISTER: '/user/auth/register',
    LOGIN: '/user/auth/login',
    PROFILE: '/user/profile',
    UPLOAD_CV: '/user/profile/profile-update',
  },
  ADMIN: {
    LOGIN: '/admin/auth/login',
    REGISTER: '/admin/auth/register',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/dashboard/users',
    USER_BY_ID: '/admin/dashboard/user',
    JOB_TITLES: '/admin/job-titles',
    JOB_POSTINGS: '/job-posting',
    DEPARTMENTS: '/admin/departments',
    RESUMES: '/resume',
    RESUME_DOWNLOAD: (id) => `/resume/${id}/download`,
    ADMINS: '/admin/admins',
    NOTIFICATIONS: '/admin/notifications',
  },
  PUBLIC: {
    UPLOADS: '/public/uploads',
    RESUME_UPLOAD: '/resume/upload',
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {},
    credentials: 'include',
  };

      const userToken = localStorage.getItem('authToken');
      const adminToken = localStorage.getItem('adminToken');
      const token = userToken || adminToken;
      if (token) {
        defaultOptions.headers.Authorization = `Bearer ${token}`;
      }

  if (!(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle empty responses
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    
    if (!response.ok && response.status !== 204) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    // For 204 No Content, return empty data
    if (response.status === 204) {
      return { data: [] };
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const api = {
  // User API
  user: {
    register: (userData) => apiRequest(API_ENDPOINTS.USER.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
    login: (credentials) => apiRequest(API_ENDPOINTS.USER.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
    getProfile: () => apiRequest(API_ENDPOINTS.USER.PROFILE),
    
    uploadCV: (formData) => apiRequest(API_ENDPOINTS.USER.UPLOAD_CV, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    }),
  },
  
  // Admin API
  admin: {
    login: (credentials) => apiRequest(API_ENDPOINTS.ADMIN.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

    register: (adminData) => apiRequest(API_ENDPOINTS.ADMIN.REGISTER, {
      method: 'POST',
      body: JSON.stringify(adminData),
    }),

    getAllUsers: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_ENDPOINTS.ADMIN.USERS}?${queryString}` : API_ENDPOINTS.ADMIN.USERS;
      return apiRequest(url);
    },

    getUserById: (userId) => apiRequest(`${API_ENDPOINTS.ADMIN.USER_BY_ID}/${userId}`),

    updateUserStatus: (userId, status) => apiRequest(`${API_ENDPOINTS.ADMIN.USER_BY_ID}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

    getAllResumes: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_ENDPOINTS.ADMIN.RESUMES}?${queryString}` : API_ENDPOINTS.ADMIN.RESUMES;
      return apiRequest(url);
    },

    getResumeById: (resumeId) => apiRequest(`${API_ENDPOINTS.ADMIN.RESUMES}/${resumeId}`),

    deleteResume: (resumeId) => apiRequest(`${API_ENDPOINTS.ADMIN.RESUMES}/${resumeId}`, {
      method: 'DELETE',
    }),

    updateResumeStatus: (resumeId, statusData) => apiRequest(`${API_ENDPOINTS.ADMIN.RESUMES}/${resumeId}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),

    updateResumeExpiry: (resumeId, expiryData) => apiRequest(`${API_ENDPOINTS.ADMIN.RESUMES}/${resumeId}/expiry`, {
      method: 'PUT',
      body: JSON.stringify(expiryData),
    }),

    checkExpiredResumes: () => apiRequest(`${API_ENDPOINTS.ADMIN.RESUMES}/check-expired`, {
      method: 'POST',
    }),

    getResumeDownloadUrl: (resumeId) => apiRequest(API_ENDPOINTS.ADMIN.RESUME_DOWNLOAD(resumeId)),

    // Job Titles
    getAllJobTitles: () => apiRequest(API_ENDPOINTS.ADMIN.JOB_TITLES),
    createJobTitle: (jobTitleData) => apiRequest(API_ENDPOINTS.ADMIN.JOB_TITLES, {
      method: 'POST',
      body: JSON.stringify(jobTitleData),
    }),
    updateJobTitle: (id, jobTitleData) => apiRequest(`${API_ENDPOINTS.ADMIN.JOB_TITLES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobTitleData),
    }),
    deleteJobTitle: (id) => apiRequest(`${API_ENDPOINTS.ADMIN.JOB_TITLES}/${id}`, {
      method: 'DELETE',
    }),
    pauseJobTitle: (id) => apiRequest(`${API_ENDPOINTS.ADMIN.JOB_TITLES}/${id}/pause`, {
      method: 'PUT',
    }),
    resumeJobTitle: (id) => apiRequest(`${API_ENDPOINTS.ADMIN.JOB_TITLES}/${id}/resume`, {
      method: 'PUT',
    }),

    // Job Postings
    getAllJobPostings: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_ENDPOINTS.ADMIN.JOB_POSTINGS}?${queryString}` : API_ENDPOINTS.ADMIN.JOB_POSTINGS;
      return apiRequest(url);
    },
    getJobPostingById: (id) => apiRequest(`${API_ENDPOINTS.ADMIN.JOB_POSTINGS}/${id}`),
    createJobPosting: (jobData) => apiRequest(API_ENDPOINTS.ADMIN.JOB_POSTINGS, {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),
    updateJobPosting: (id, jobData) => apiRequest(`${API_ENDPOINTS.ADMIN.JOB_POSTINGS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    }),
    deleteJobPosting: (id) => apiRequest(`${API_ENDPOINTS.ADMIN.JOB_POSTINGS}/${id}`, {
      method: 'DELETE',
    }),
    pauseJobPosting: (id) => apiRequest(`${API_ENDPOINTS.ADMIN.JOB_POSTINGS}/${id}/pause`, {
      method: 'PUT',
    }),
    resumeJobPosting: (id) => apiRequest(`${API_ENDPOINTS.ADMIN.JOB_POSTINGS}/${id}/resume`, {
      method: 'PUT',
    }),

    // Notifications
    getRecentCvs: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_ENDPOINTS.ADMIN.NOTIFICATIONS}/recent-cvs?${queryString}` : `${API_ENDPOINTS.ADMIN.NOTIFICATIONS}/recent-cvs`;
      return apiRequest(url);
    },
    markNotificationAsRead: (notificationId) => apiRequest(`${API_ENDPOINTS.ADMIN.NOTIFICATIONS}/${notificationId}/read`, {
      method: 'PUT',
    }),

    // Departments
    getAllDepartments: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_ENDPOINTS.ADMIN.DEPARTMENTS}?${queryString}` : API_ENDPOINTS.ADMIN.DEPARTMENTS;
      return apiRequest(url);
    },
    createDepartment: (deptData) => apiRequest(API_ENDPOINTS.ADMIN.DEPARTMENTS, {
      method: 'POST',
      body: JSON.stringify(deptData),
    }),
    updateDepartment: (id, deptData) => apiRequest(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deptData),
    }),
    holdDepartment: (id) => apiRequest(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}/${id}/hold`, {
      method: 'PUT',
    }),
    reactivateDepartment: (id) => apiRequest(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}/${id}/reactivate`, {
      method: 'PUT',
    }),

    // Admins
    getAllAdmins: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_ENDPOINTS.ADMIN.ADMINS}?${queryString}` : API_ENDPOINTS.ADMIN.ADMINS;
      return apiRequest(url);
    },
  },

  // Public API
  public: {
    uploadResume: (formData) => apiRequest(API_ENDPOINTS.PUBLIC.RESUME_UPLOAD, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    }),
  },
};