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
    INTEREST_ROLES: '/admin/intrest-roles',
  },
  PUBLIC: {
    UPLOADS: '/public/uploads',
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
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Specific API functions
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

        updateUserStatus: (userId, status) => apiRequest(`${API_ENDPOINTS.ADMIN.USER_BY_ID}/${userId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status }),
        }),

        getAllInterestRoles: () => apiRequest(API_ENDPOINTS.ADMIN.INTEREST_ROLES),

        createInterestRole: (roleData) => apiRequest(API_ENDPOINTS.ADMIN.INTEREST_ROLES, {
          method: 'POST',
          body: JSON.stringify(roleData),
        }),

        updateInterestRole: (roleId, roleData) => apiRequest(`${API_ENDPOINTS.ADMIN.INTEREST_ROLES}/${roleId}`, {
          method: 'PUT',
          body: JSON.stringify(roleData),
        }),

        deleteInterestRole: (roleId) => apiRequest(`${API_ENDPOINTS.ADMIN.INTEREST_ROLES}/${roleId}`, {
          method: 'DELETE',
        }),
      },
};

export default api;
