import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification,
  deleteAllNotifications,
  getRecentCvNotifications
} from '../admin/controller/notification.controller.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorizeAdmin);

// Get notifications with pagination and filters
router.get('/', getNotifications);

// Get unread count for admin
router.get('/unread-count', getUnreadCount);

// Get recent CV notifications
router.get('/recent-cvs', getRecentCvNotifications);

// Mark all notifications as read
router.put('/mark-all-read', markAllNotificationsAsRead);

// Delete all notifications
router.delete('/delete-all', deleteAllNotifications);

// Mark specific notification as read
router.put('/:notificationId/read', markNotificationAsRead);

// Delete notification
router.delete('/:notificationId', deleteNotification);

export default router;