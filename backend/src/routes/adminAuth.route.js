import express from 'express';
import { adminLogin, adminRegistration, getAllAdmins, createDefaultAdmin, createAdminWithoutAuth, createSuperAdmin, deleteAdmin } from '../admin/controller/auth.controller.js';
import { authenticate, authorizeRoles, validateSuperAdminCreationToken } from '../middleware/auth.middleware.js';
import { getAllUser, getUserById, deleteUser } from '../admin/controller/dashboard.controller.js';
import { createJobTitle, deleteJobTitle, getAllJobTitles, getJobTitleById, updateJobTitle, resumeJobTitle } from '../admin/controller/jobTitle.controller.js';

const adminAuthRouter = express.Router();

adminAuthRouter.route('/auth/register').post(authenticate, authorizeRoles('admin', 'super_admin'), adminRegistration)
adminAuthRouter.route('/auth/register-default').post(createDefaultAdmin) // No authentication required
adminAuthRouter.route('/auth/register-emergency').post(createAdminWithoutAuth) // No authentication required - for emergency admin creation
adminAuthRouter.route('/auth/register-super-admin').post(validateSuperAdminCreationToken, createSuperAdmin) // Token protection required for super admin creation
adminAuthRouter.route('/auth/login').post(adminLogin)
adminAuthRouter.route('/admins').get(authenticate, authorizeRoles('admin', 'super_admin'), getAllAdmins)
adminAuthRouter.route('/admins/:id').delete(authenticate, authorizeRoles('super_admin'), deleteAdmin) // Only super admin can delete admins

adminAuthRouter.route('/dashboard/users').get(authenticate ,authorizeRoles('admin', 'super_admin'), getAllUser)
adminAuthRouter.route('/dashboard/user/:id').get(authenticate , authorizeRoles('admin', 'super_admin'), getUserById)
adminAuthRouter.route('/dashboard/user/:id').delete(authenticate, authorizeRoles('admin', 'super_admin'), deleteUser)

adminAuthRouter.route('/job-titles').get(authenticate , getAllJobTitles).post(authenticate,authorizeRoles('admin', 'super_admin'), createJobTitle);
adminAuthRouter.route('/job-titles/:id').get(authenticate, getJobTitleById).put(authenticate, authorizeRoles('admin', 'super_admin'),updateJobTitle).delete(authenticate, authorizeRoles('admin', 'super_admin') ,deleteJobTitle);
adminAuthRouter.route('/job-titles/:id/resume').put(authenticate, authorizeRoles('admin', 'super_admin'), resumeJobTitle);

export default adminAuthRouter;