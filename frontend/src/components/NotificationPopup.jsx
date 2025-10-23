import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead } from '../features/notifications/notificationSlice';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Bell, 
  X, 
  Check, 
  FileText, 
  Clock,
  User
} from 'lucide-react';

const NotificationPopup = () => {
  const dispatch = useDispatch();
  const { newCvNotifications, unreadCount } = useSelector((state) => state.notifications);
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationQueue, setNotificationQueue] = useState([]);

  // Show popup when new notifications arrive
  useEffect(() => {
    if (newCvNotifications.length > 0) {
      const latestNotification = newCvNotifications[0];
      
      // Only show if it's a new notification (not already shown)
      if (!latestNotification.read && latestNotification !== currentNotification) {
        setCurrentNotification(latestNotification);
        setIsVisible(true);
        
        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
          // Mark as read after showing
          setTimeout(() => {
            dispatch(markAsRead(latestNotification.id));
            setCurrentNotification(null);
          }, 500);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [newCvNotifications, currentNotification, dispatch]);

  const handleClose = () => {
    setIsVisible(false);
    if (currentNotification) {
      dispatch(markAsRead(currentNotification.id));
      setCurrentNotification(null);
    }
  };

  const handleViewAll = () => {
    setIsVisible(false);
    // You can navigate to a notifications page or show a full list
    console.log('View all notifications');
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Just now';
      
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch (error) {
      return 'Just now';
    }
  };

  if (!isVisible || !currentNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg transform transition-all duration-300 ease-out animate-in slide-in-from-right-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">New Notification</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatTimeAgo(currentNotification.timestamp)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                <span className="font-medium text-slate-900 dark:text-white text-sm">
                  New CV Upload
                </span>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {currentNotification.message}
              </p>

              {/* CV Details */}
              {currentNotification.cvData && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs">
                        {currentNotification.cvData.name ? 
                          currentNotification.cvData.name.split(' ').map(n => n[0]).join('') : 
                          'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                        {currentNotification.cvData.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {currentNotification.cvData.email || 'No email'}
                      </p>
                    </div>
                  </div>
                  
                  {currentNotification.cvData.role && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {currentNotification.cvData.role}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="flex-1 text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark as Read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewAll}
                  className="text-xs"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {unreadCount > 1 && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 rounded-b-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              {unreadCount - 1} more notification{unreadCount - 1 !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
