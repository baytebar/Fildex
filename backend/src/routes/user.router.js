import express from 'express';
import multer from 'multer';
import { updateProfile, getProfile } from '../controller/user.controller.js';
import { userLogin, userRegistration } from '../controller/userAuth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../config/multer.config.js';

const userRouter = express.Router();

// Get user profile
userRouter.get('/profile', authenticate, getProfile);

// Single CV upload route
userRouter.post(
  "/profile/profile-update",
  authenticate,
  upload.single("cv"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // Multer errors (e.g. file too large)
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      // Other errors (e.g. invalid file type)
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  },
  updateProfile
);

userRouter.route('/auth/register').post(userRegistration)
userRouter.route('/auth/login').post(userLogin)



export default userRouter;