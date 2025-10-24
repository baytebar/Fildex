import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['cv_upload', 'job_application', 'system_alert'],
    default: 'cv_upload'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  cvData: {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
    email: { type: String },
    role: { type: String },
    phone: { type: String },
    createdAt: { type: Date }
  },
  readBy: [{
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Notification', notificationSchema);
