import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import socketService from '../../services/socketService';

// Async thunk to fetch recent CVs from server
export const fetchRecentCvs = createAsyncThunk(
  'notifications/fetchRecentCvs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.admin.getRecentCvs();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to check for new CVs from server
export const checkForNewCvs = createAsyncThunk(
  'notifications/checkForNewCvs',
  async (lastChecked, { rejectWithValue }) => {
    try {
      const response = await api.admin.getRecentCvs({ since: lastChecked });
      
      if (!response.data || !response.data.notifications) {
        return { newCvs: [], lastChecked: new Date().toISOString() };
      }
      
      const newCvs = response.data.notifications;
      return { newCvs, lastChecked: response.data.lastChecked };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    recentCvs: [],
    newCvNotifications: [],
    lastChecked: null,
    isLoading: false,
    error: null,
    unreadCount: 0
  },
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'cv_upload',
        message: action.payload.message,
        cvData: action.payload.cvData,
        timestamp: new Date().toISOString(),
        read: false
      };
      state.newCvNotifications.unshift(notification);
      state.unreadCount += 1;
    },
    addCvUploadNotification: (state, action) => {
      const { name, role } = action.payload;
      const notification = {
        id: Date.now() + Math.random(),
        type: 'cv_upload',
        message: `${name || 'Unknown User'} uploaded a CV${role ? ` for ${role}` : ''}`,
        cvData: action.payload,
        timestamp: new Date().toISOString(),
        read: false
      };
      state.newCvNotifications.unshift(notification);
      state.unreadCount += 1;
    },
    addSocketNotification: (state, action) => {
      const notification = action.payload;
      // Check if notification already exists to prevent duplicates
      const existingNotification = state.newCvNotifications.find(n => 
        n.cvData?._id === notification.cvData?._id || n.id === notification.id
      );
      
      if (!existingNotification) {
        state.newCvNotifications.unshift(notification);
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action) => {
      const notification = state.newCvNotifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.newCvNotifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.newCvNotifications = [];
      state.unreadCount = 0;
    },
    setLastChecked: (state, action) => {
      state.lastChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentCvs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentCvs.fulfilled, (state, action) => {
        state.isLoading = false;
        const { notifications } = action.payload;
        
        // Initialize notifications with recent CVs, mark them as read initially
        if (notifications && Array.isArray(notifications)) {
          state.newCvNotifications = notifications.map(notification => ({
            ...notification,
            read: true // Mark as read initially to avoid showing old notifications as new
          }));
          state.lastChecked = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(fetchRecentCvs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(checkForNewCvs.fulfilled, (state, action) => {
        const { newCvs, lastChecked } = action.payload;
        state.lastChecked = lastChecked;
        
        // Add notifications for new CVs
        newCvs.forEach(cv => {
          // Check if notification already exists to prevent duplicates
          const existingNotification = state.newCvNotifications.find(n => 
            n.cvData?._id === cv._id || n.id === cv._id
          );
          
          if (!existingNotification) {
            const notification = {
              id: cv._id, // Use CV ID as notification ID for uniqueness
              type: 'cv_upload',
              message: `${cv.name || 'Unknown User'} uploaded a CV${cv.role ? ` for ${cv.role}` : ''}`,
              cvData: cv,
              timestamp: cv.createdAt,
              read: false
            };
            state.newCvNotifications.unshift(notification);
            state.unreadCount += 1;
          }
        });
      });
  }
});

export const { 
  addNotification, 
  addCvUploadNotification,
  addSocketNotification,
  markAsRead, 
  markAllAsRead, 
  clearNotifications, 
  setLastChecked 
} = notificationSlice.actions;

export default notificationSlice.reducer;
