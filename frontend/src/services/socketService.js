import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Extract base URL from API_BASE_URL (remove /api/v1)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    const serverUrl = apiBaseUrl.replace('/api/v1', '');
    
    console.log('🔌 Connecting to Socket.IO server:', serverUrl);
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected to server:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO disconnected from server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket.IO reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Socket.IO reconnection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-admin');
      console.log('✅ Joined admin room');
    } else {
      console.log('❌ Cannot join admin room - socket not connected');
    }
  }

  onNewCvUpload(callback) {
    if (this.socket) {
      this.socket.on('new-cv-upload', callback);
    }
  }

  offNewCvUpload(callback) {
    if (this.socket) {
      this.socket.off('new-cv-upload', callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;

