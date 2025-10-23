# Notification System Debug Guide

## 🔍 **Step-by-Step Debugging:**

### **1. Check Backend Server**
```bash
cd backend
npm start
```
**Expected**: Should see:
- `🚀 Server is running on port 5000`
- `🔌 Socket.IO server ready for connections`

### **2. Check Frontend**
```bash
cd frontend
npm run dev
```
**Expected**: Should see:
- Vite dev server running
- No console errors

### **3. Check Browser Console**
Open browser developer tools (F12) and look for:

**Socket.IO Connection:**
- `🔌 Initializing Socket.IO connection...`
- `✅ Socket.IO connected to server: [socket-id]`
- `🔌 Socket connected, joining admin room...`
- `✅ Successfully joined admin room`

**When CV is uploaded:**
- `🔔 Received new CV upload notification: [notification-data]`

### **4. Check Redux State**
In browser console, run:
```javascript
// Check notification state
console.log('Notification state:', store.getState().notifications);

// Check if Socket.IO is connected
console.log('Socket connected:', window.socketService?.isSocketConnected());
```

### **5. Test Socket.IO Connection**
In browser console, run:
```javascript
// Check if socket exists
console.log('Socket:', window.socketService?.getSocket());

// Check connection status
console.log('Is connected:', window.socketService?.isSocketConnected());
```

## 🐛 **Common Issues:**

### **Issue 1: Socket.IO Not Connecting**
**Symptoms**: No connection messages in console
**Solutions**:
1. Check if backend is running on port 5000
2. Check CORS configuration in server.js
3. Check if frontend is connecting to correct URL

### **Issue 2: Notifications Not Triggering**
**Symptoms**: Socket connects but no notifications appear
**Solutions**:
1. Check if admin is logged in
2. Check if admin has joined the 'admin' room
3. Check if resume upload is triggering Socket.IO events

### **Issue 3: Popup Not Appearing**
**Symptoms**: Notifications received but no popup
**Solutions**:
1. Check Redux state for newCvNotifications
2. Check if NotificationPopup component is rendered
3. Check if popup is being hidden by CSS

### **Issue 4: Backend Not Sending Notifications**
**Symptoms**: CV uploads but no Socket.IO events
**Solutions**:
1. Check if global.io is available in resume controller
2. Check if Socket.IO events are being emitted
3. Check backend console for notification logs

## 🧪 **Manual Testing:**

### **Test 1: Socket.IO Connection**
1. Open admin dashboard
2. Check browser console for connection messages
3. Look for green dot next to notification bell (if connected)

### **Test 2: Upload CV**
1. Go to public CV upload form
2. Upload a CV
3. Check backend console for:
   - `🔔 Sending CV upload notification to admin room: [data]`
   - `✅ CV upload notification sent to admin room`

### **Test 3: Check Frontend**
1. Check browser console for:
   - `🔔 Received new CV upload notification: [data]`
2. Check if popup appears
3. Check if notification count updates

## 🔧 **Quick Fixes:**

### **Fix 1: Restart Everything**
```bash
# Stop all processes
# Then restart:
cd backend && npm start
cd frontend && npm run dev
```

### **Fix 2: Clear Browser Cache**
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Check if notifications work

### **Fix 3: Check Network Tab**
- Open Network tab in dev tools
- Look for WebSocket connections
- Check if Socket.IO is connecting

## 📋 **Debug Checklist:**

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Socket.IO connection established
- [ ] Admin room joined
- [ ] CV upload triggers backend notification
- [ ] Frontend receives notification
- [ ] Redux state updates
- [ ] Popup appears
- [ ] Notification count updates
