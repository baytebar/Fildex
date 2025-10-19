import express from 'express';
import multer from 'multer';
import { updateProfile, getProfile } from '../controller/user.controller.js';
import { userLogin, userRegistration } from '../controller/userAuth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../config/multer.config.js';

const userRouter = express.Router();

userRouter.get('/profile', authenticate, getProfile);

userRouter.post(
  "/profile/profile-update",
  authenticate,
  upload.single("cv"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  },
  updateProfile
);

userRouter.route('/auth/register').post(userRegistration)
userRouter.route('/auth/login').post(userLogin)



export default userRouter;