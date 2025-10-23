# Notification System Test Guide

## Issues Fixed:

1. **Socket.IO Connection URL**: Fixed the frontend to connect to the correct server URL (removed `/api/v1` from the Socket.IO connection)
2. **CORS Configuration**: Updated backend CORS to include production domains
3. **Notification Fetching**: Re-enabled automatic fetching of recent CVs in both AdminLayout and AdminDashboard
4. **Debugging**: Added comprehensive logging to track Socket.IO connections and notifications
5. **Error Handling**: Improved error handling and reconnection logic

## How to Test:

### 1. Start the Backend Server
```bash
cd backend
npm start
```
You should see:
- `🚀 Server is running on port 5000`
- `🔌 Socket.IO server ready for connections`

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Socket.IO Connection
1. Open the admin dashboard
2. Open browser developer tools (F12)
3. Look for these console messages:
   - `🔌 Initializing Socket.IO connection...`
   - `✅ Socket.IO connected to server: [socket-id]`
   - `🔌 Socket connected, joining admin room...`
   - `✅ Successfully joined admin room`

### 4. Test Notifications
1. Upload a CV through the public form
2. Check the backend console for:
   - `🔔 Sending CV upload notification to admin room: [notification-data]`
   - `✅ CV upload notification sent to admin room`
3. Check the frontend console for:
   - `🔔 Received new CV upload notification: [notification-data]`
4. You should see a toast notification in the admin dashboard
5. The notification should appear in the notifications panel

### 5. Test Polling (Fallback)
If Socket.IO fails, the system will fall back to polling every 30 seconds:
- Check the Network tab for requests to `/api/v1/admin/notifications/recent-cvs`
- Look for console messages about polling

## Troubleshooting:

### If Socket.IO Connection Fails:
1. Check that both frontend and backend are running
2. Verify the CORS configuration includes your frontend URL
3. Check browser console for connection errors
4. The system will fall back to polling if Socket.IO fails

### If Notifications Don't Appear:
1. Check that the admin is logged in
2. Verify the Socket.IO connection is established
3. Check that the admin has joined the 'admin' room
4. Test with the "Test Notification" button in the admin dashboard

### If Polling Doesn't Work:
1. Check the Network tab for API requests
2. Verify the notification API endpoint is working
3. Check for authentication errors

## Expected Behavior:

1. **Real-time Notifications**: When a CV is uploaded, admins should receive instant notifications
2. **Toast Notifications**: Pop-up toast messages should appear
3. **Notification Panel**: Notifications should appear in the notifications panel
4. **Unread Count**: The notification bell should show unread count
5. **Fallback Polling**: If Socket.IO fails, polling should work as backup

## Files Modified:

- `frontend/src/services/socketService.js` - Fixed connection URL and added debugging
- `frontend/src/hooks/useSocket.js` - Added debugging and better error handling
- `frontend/src/Admin/layout/AdminLayout.jsx` - Re-enabled notification fetching
- `frontend/src/Admin/components/AdminDashboard.jsx` - Re-enabled notification fetching
- `backend/server.js` - Updated CORS and added debugging
- `backend/src/admin/controller/resume.controller.js` - Added debugging to notifications
