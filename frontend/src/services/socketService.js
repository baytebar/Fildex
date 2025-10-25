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
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000/api/v1' 
        : 'http://46.62.206.205:5000/api/v1');
    const serverUrl = apiBaseUrl.replace('/api/v1', '');
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      this.isConnected = true;
    });

    this.socket.on('reconnect_error', (error) => {
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
    } else {
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

