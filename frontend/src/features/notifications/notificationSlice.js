import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import socketService from '../../services/socketService';

// Async thunk to fetch recent CVs from server
const fetchRecentCvs = createAsyncThunk(
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
const checkForNewCvs = createAsyncThunk(
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

// Async thunk for fetching notifications from database
const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.admin.getNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for getting unread count
const getUnreadCount = createAsyncThunk(
  'notifications/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.admin.getUnreadCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for marking notification as read
const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.admin.markNotificationAsRead(notificationId);
      return { notificationId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for marking all notifications as read
const markAllNotificationsAsReadAsync = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.admin.markAllNotificationsAsRead();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting notification
const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.admin.deleteNotification(notificationId);
      return { notificationId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting all notifications
const deleteAllNotifications = createAsyncThunk(
  'notifications/deleteAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // Delete all notifications one by one
      // Note: This could be optimized with a bulk delete endpoint
      const response = await api.admin.deleteAllNotifications();
      return response.data;
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
    notifications: [],
    lastChecked: null,
    isLoading: false,
    error: null,
    unreadCount: 0,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalNotifications: 0,
      limit: 10
    }
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
    },
    // Calculate unread count based on actual notifications
    calculateUnreadCount: (state) => {
      state.unreadCount = state.newCvNotifications.filter(notification => !notification.read).length;
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
        
        // Initialize notifications with recent CVs, preserve their read status
        if (notifications && Array.isArray(notifications)) {
          // Only add new notifications that don't already exist
          notifications.forEach(notification => {
            const existingNotification = state.newCvNotifications.find(n => 
              n.cvData?._id === notification.cvData?._id || n.id === notification.id
            );
            
            if (!existingNotification) {
              state.newCvNotifications.unshift(notification);
              // Only increment unread count if notification is not read
              if (!notification.read) {
                state.unreadCount += 1;
              }
            }
          });
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
      })
      // Database-backed notification reducers
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUnreadCount.pending, (state) => {
        // No loading state for unread count
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        // Optimistic update
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        // Update notification in the list
        const notification = state.notifications.find(n => n._id === notificationId);
        if (notification) {
          notification.isReadByAdmin = true;
        }
        // Update newCvNotifications as well
        const newCvNotification = state.newCvNotifications.find(n => n.id === notificationId);
        if (newCvNotification) {
          newCvNotification.read = true;
        }
        // Recalculate unread count
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markAllNotificationsAsReadAsync.pending, (state) => {
        // Optimistic update
      })
      .addCase(markAllNotificationsAsReadAsync.fulfilled, (state, action) => {
        // Mark all notifications as read
        state.notifications.forEach(notification => {
          notification.isReadByAdmin = true;
        });
        state.newCvNotifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsReadAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteNotification.pending, (state) => {
        // Optimistic update
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        // Remove notification from database notifications
        state.notifications = state.notifications.filter(notification => notification._id !== notificationId);
        // Remove from Socket.IO notifications if it exists there
        state.newCvNotifications = state.newCvNotifications.filter(notification => notification.id !== notificationId);
        // Recalculate unread count
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteAllNotifications.pending, (state) => {
        // Optimistic update
      })
      .addCase(deleteAllNotifications.fulfilled, (state, action) => {
        // Clear all notifications
        state.notifications = [];
        state.newCvNotifications = [];
        state.unreadCount = 0;
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.error = action.payload;
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
  setLastChecked,
  calculateUnreadCount
} = notificationSlice.actions;

// Export async thunks
export {
  fetchRecentCvs,
  checkForNewCvs,
  fetchNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsReadAsync,
  deleteNotification,
  deleteAllNotifications
};

export default notificationSlice.reducer;
