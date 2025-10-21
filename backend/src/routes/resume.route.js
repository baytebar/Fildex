import express from 'express';
import { uploadResume, getAllResumes, getResumeById, deleteResume, getResumeDownloadUrl, updateResumeStatus, updateResumeExpiry, checkExpiredResumes } from '../admin/controller/resume.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';
import upload from '../config/multer.config.js';

const resumeRouter = express.Router();

// Resume upload route (no authentication required for public upload)
resumeRouter.post(
  "/upload",
  upload.single("resume"),
  (err, req, res, next) => {
    if (err instanceof upload.MulterError) {
      // Multer errors (e.g. file too large)
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      // Other errors (e.g. invalid file type)
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  },
  uploadResume
);

// Admin routes (require authentication and admin authorization)
resumeRouter.get("/", authenticate, authorizeAdmin, getAllResumes);
resumeRouter.get("/:id", authenticate, authorizeAdmin, getResumeById);
resumeRouter.get("/:id/download", authenticate, authorizeAdmin, getResumeDownloadUrl);
resumeRouter.put("/:id", authenticate, authorizeAdmin, updateResumeStatus);
resumeRouter.put("/:id/expiry", authenticate, authorizeAdmin, updateResumeExpiry);
resumeRouter.post("/check-expired", authenticate, authorizeAdmin, checkExpiredResumes);
resumeRouter.delete("/:id", authenticate, authorizeAdmin, deleteResume);

export default resumeRouter;