import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { getRecentCvs, markNotificationAsRead } from '../admin/controller/notification.controller.js';

const notificationRouter = express.Router();

// Get recent CVs for notifications (admin only)
notificationRouter.route('/recent-cvs')
  .get(authenticate, authorizeRoles("admin", "super_admin"), getRecentCvs);

// Mark notification as read
notificationRouter.route('/:notificationId/read')
  .put(authenticate, authorizeRoles("admin", "super_admin"), markNotificationAsRead);

export default notificationRouter;


