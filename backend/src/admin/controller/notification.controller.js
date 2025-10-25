import { handleResponse } from "../../utils/responseHandler.utils.js";
import { HttpStatusCodes } from "../../constants/statusCode.constants.js";
import Notification from "../../models/notification.model.js";
import Resume from "../models/resume.model.js";

// Create a new notification
export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();
    return savedNotification;
  } catch (error) {
    throw error;
  }
};

// Get notifications for admin
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, isRead } = req.query;
    const adminId = req.auth.id;

    // Build query
    const query = {};
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Check which notifications are read by this admin
    const notificationsWithReadStatus = notifications.map(notification => ({
      ...notification,
      isReadByAdmin: notification.readBy.some(read => read.adminId.toString() === adminId.toString())
    }));

    const total = await Notification.countDocuments(query);

    return handleResponse(res, HttpStatusCodes.OK, "Notifications fetched successfully", {
      notifications: notificationsWithReadStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read by admin
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const adminId = req.auth.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, "Notification not found", null);
    }

    // Check if already read by this admin
    const alreadyRead = notification.readBy.some(read => 
      read.adminId.toString() === adminId.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({
        adminId: adminId,
        readAt: new Date()
      });

      // Update isRead status if any admin has read it
      notification.isRead = notification.readBy.length > 0;
      await notification.save();
    }

    return handleResponse(res, HttpStatusCodes.OK, "Notification marked as read", {
      notificationId,
      readBy: notification.readBy
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read by admin
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const adminId = req.auth.id;

    // Get all unread notifications
    const unreadNotifications = await Notification.find({
      'readBy.adminId': { $ne: adminId }
    });

    // Mark each notification as read by this admin
    const updatePromises = unreadNotifications.map(notification => {
      notification.readBy.push({
        adminId: adminId,
        readAt: new Date()
      });
      notification.isRead = true;
      return notification.save();
    });

    await Promise.all(updatePromises);

    return handleResponse(res, HttpStatusCodes.OK, "All notifications marked as read", {
      updatedCount: unreadNotifications.length
    });
  } catch (error) {
    next(error);
  }
};

// Get unread count for admin
export const getUnreadCount = async (req, res, next) => {
  try {
    const adminId = req.auth.id;

    const unreadCount = await Notification.countDocuments({
      'readBy.adminId': { $ne: adminId }
    });

    return handleResponse(res, HttpStatusCodes.OK, "Unread count fetched successfully", {
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification (admin only)
export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, "Notification not found", null);
    }

    return handleResponse(res, HttpStatusCodes.OK, "Notification deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

// Delete all notifications (admin only)
export const deleteAllNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({});
    
    return handleResponse(res, HttpStatusCodes.OK, "All notifications deleted successfully", {
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

// Get recent CV notifications
export const getRecentCvNotifications = async (req, res, next) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000);

    const notifications = await Notification.find({
      type: 'cv_upload',
      createdAt: { $gt: sinceDate }
    }).sort({ createdAt: -1 }).limit(10);

    return handleResponse(res, HttpStatusCodes.OK, "Recent CV notifications fetched successfully", {
      notifications,
      lastChecked: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};