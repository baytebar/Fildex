import { handleResponse } from "../../utils/responseHandler.utils.js";
import { HttpStatusCodes } from "../../constants/statusCode.constants.js";
import Resume from "../models/resume.model.js";

// Get recent CVs for notifications
export const getRecentCvs = async (req, res, next) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to last 24 hours
    
    const recentCvs = await Resume.find({
      createdAt: { $gt: sinceDate }
    }).sort({ createdAt: -1 }).limit(10);

    const notifications = recentCvs.map(cv => ({
      id: cv._id,
      type: 'cv_upload',
      message: `${cv.name || 'Unknown User'} uploaded a CV${cv.role ? ` for ${cv.role}` : ''}`,
      cvData: {
        _id: cv._id,
        name: cv.name,
        email: cv.email,
        role: cv.role || 'General Position',
        phone: cv.contact?.number || '',
        createdAt: cv.createdAt
      },
      timestamp: cv.createdAt,
      read: false
    }));

    return handleResponse(res, HttpStatusCodes.OK, "Recent CVs fetched successfully", {
      notifications,
      lastChecked: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    // For now, we'll just return success since we're not storing read status on server
    // In a real implementation, you'd store read status in a notifications collection
    return handleResponse(res, HttpStatusCodes.OK, "Notification marked as read", {
      notificationId,
      read: true
    });
  } catch (error) {
    next(error);
  }
};
