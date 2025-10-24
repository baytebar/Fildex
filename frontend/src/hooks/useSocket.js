import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addSocketNotification } from '../features/notifications/notificationSlice';
import { fetchAllResumes } from '../features/resume/resumeSlice';
import socketService from '../services/socketService';

export const useSocket = () => {
  const dispatch = useDispatch();
  const isConnected = useRef(false);

  useEffect(() => {
    console.log('🔌 Initializing Socket.IO connection...');
    
    // Connect to socket
    const socket = socketService.connect();
    
    // Join admin room when connected
    const handleConnect = () => {
      console.log('🔌 Socket connected, joining admin room...');
      if (!isConnected.current) {
        socketService.joinAdminRoom();
        isConnected.current = true;
        console.log('✅ Successfully joined admin room');
      }
    };

    // Handle new CV upload notifications
    const handleNewCvUpload = (notification) => {
      console.log('🔔 Received new CV upload notification:', notification);
      dispatch(addSocketNotification(notification));
      
      // Refresh the CV list to show the new CV
      dispatch(fetchAllResumes({ page: 1, limit: 10 }))
        .unwrap()
        .catch((error) => {
          console.error('Failed to refresh CV list:', error);
        });
      
      // Toast notification removed - using popup notifications instead
    };

    // Set up event listeners
    socket.on('connect', handleConnect);
    socket.on('new-cv-upload', handleNewCvUpload);

    // Cleanup on unmount
    return () => {
      console.log('🔌 Cleaning up Socket.IO connection...');
      socket.off('connect', handleConnect);
      socket.off('new-cv-upload', handleNewCvUpload);
      socketService.disconnect();
      isConnected.current = false;
    };
  }, [dispatch]);

  return {
    isConnected: socketService.isSocketConnected(),
    socket: socketService.getSocket()
  };
};
