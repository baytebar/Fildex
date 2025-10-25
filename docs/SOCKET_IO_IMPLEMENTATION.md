# Socket.IO Real-time Notifications Implementation

This document describes the implementation of real-time notifications using Socket.IO for CV form submissions in the Fildex application.

## Overview

The implementation adds real-time notifications to the admin panel when users submit CV forms. When a user uploads a CV, all connected admin users will receive an instant notification.

## Architecture

### Backend (Node.js + Express)
- **Socket.IO Server**: Integrated into the main Express server
- **Notification Emission**: CV upload controller emits notifications to 'admin' room
- **Room Management**: Admin users join the 'admin' room for notifications

### Frontend (React + Redux)
- **Socket.IO Client**: Service for managing Socket.IO connections
- **Redux Integration**: Notifications stored in Redux store
- **Real-time Updates**: UI updates automatically when notifications arrive
- **Toast Notifications**: User-friendly popup notifications

## Files Modified/Added

### Backend Files
1. **server.js** - Added Socket.IO server setup
2. **resume.controller.js** - Added notification emission on CV upload

### Frontend Files
1. **services/socketService.js** - Socket.IO client service
2. **hooks/useSocket.js** - React hook for Socket.IO integration
3. **features/notifications/notificationSlice.js** - Added Socket.IO notification handling
4. **Admin/layout/AdminLayout.jsx** - Added connection status indicators
5. **Admin/components/AdminDashboard.jsx** - Added Socket.IO test functionality

## How It Works

1. **Admin Connection**: When admin panel loads, it connects to Socket.IO server and joins 'admin' room
2. **CV Upload**: When user submits CV form, backend saves CV and emits notification to 'admin' room
3. **Real-time Delivery**: All connected admin users receive the notification instantly
4. **UI Updates**: Notification appears in admin panel with toast popup
5. **Connection Status**: Visual indicators show Socket.IO connection status

## Testing the Implementation

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Steps
1. Open admin panel in browser
2. Check for green connection indicator on notification bell
3. Use "Test Socket.IO" button to verify connection
4. Open another browser tab with CV upload form
5. Submit a CV form
6. Check admin panel for instant notification

### 4. Expected Behavior
- Admin panel shows "Live" indicator when connected
- CV upload triggers instant notification in admin panel
- Toast notification appears with CV details
- Notification count updates in real-time

## Configuration

### Environment Variables
- `VITE_API_BASE_URL`: Frontend API base URL (defaults to localhost:5000)
- `PORT`: Backend server port (defaults to 5000)

### CORS Configuration
Socket.IO CORS is configured to allow connections from:
- Production domains (fildex.ie, www.fildex.ie)
- Server IP (46.62.206.205)
- Local development (localhost:5173, etc.)

## Features

### Real-time Notifications
- Instant delivery of CV upload notifications
- No page refresh required
- Works across multiple admin sessions

### Connection Management
- Automatic reconnection on connection loss
- Connection status indicators
- Graceful error handling

### User Experience
- Toast notifications for immediate feedback
- Visual connection status indicators
- Unread notification counts
- Real-time notification panel

## Troubleshooting

### Connection Issues
1. Check server is running on correct port
2. Verify CORS configuration
3. Check browser console for errors
4. Ensure Socket.IO dependencies are installed

### Notification Issues
1. Verify admin is in 'admin' room
2. Check backend console for emission logs
3. Test with "Test Socket.IO" button
4. Check Redux store for notifications

### Development Tips
- Use browser dev tools to monitor Socket.IO events
- Check server console for connection logs
- Test with multiple browser tabs
- Verify notification data structure

## Future Enhancements

- Notification persistence across sessions
- Email notifications for offline admins
- Notification categories and filtering
- Real-time chat between admins
- File upload progress notifications
