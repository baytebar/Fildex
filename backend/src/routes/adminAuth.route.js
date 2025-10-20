import express from 'express';
import { adminLogin, adminRegistration, getAllAdmins } from '../admin/controller/auth.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { getAllUser, getUserById } from '../admin/controller/dashboard.controller.js';
import { createJobTitle, deleteJobTitle, getAllJobTitles, getJobTitleById, updateJobTitle, resumeJobTitle } from '../admin/controller/jobTitle.controller.js';

const adminAuthRouter = express.Router();

adminAuthRouter.route('/auth/register').post(authenticate, authorizeRoles('admin'), adminRegistration)
adminAuthRouter.route('/auth/login').post(adminLogin)
adminAuthRouter.route('/admins').get(authenticate, authorizeRoles('admin'), getAllAdmins)

adminAuthRouter.route('/dashboard/users').get(authenticate ,authorizeRoles('admin'), getAllUser)
adminAuthRouter.route('/dashboard/user/:id').get(authenticate , authorizeRoles('admin'), getUserById)

adminAuthRouter.route('/job-titles').get(authenticate , getAllJobTitles).post(authenticate,authorizeRoles('admin'), createJobTitle);
adminAuthRouter.route('/job-titles/:id').get(authenticate, getJobTitleById).put(authenticate, authorizeRoles('admin'),updateJobTitle).delete(authenticate, authorizeRoles('admin') ,deleteJobTitle);
adminAuthRouter.route('/job-titles/:id/resume').put(authenticate, authorizeRoles('admin'), resumeJobTitle);

export default adminAuthRouter;