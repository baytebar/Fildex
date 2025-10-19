import express from 'express';
import { adminLogin, adminRegistration } from '../admin/controller/auth.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { getAllUser, getUserById, updateUserStatus } from '../admin/controller/dashboard.controller.js';
import { createInterestRole, deleteInterestRole, getAllInterestRoles, getInterestRoleById, updateInterestRole } from '../admin/controller/userRole.controller.js';

const adminAuthRouter = express.Router();

adminAuthRouter.route('/auth/register').post(adminRegistration)
adminAuthRouter.route('/auth/login').post(adminLogin)

adminAuthRouter.route('/dashboard/users').get(authenticate ,authorizeRoles('admin'), getAllUser)
adminAuthRouter.route('/dashboard/user/:id').get(authenticate , authorizeRoles('admin'), getUserById)
adminAuthRouter.route('/dashboard/user/:id/status').put(authenticate, authorizeRoles('admin'), updateUserStatus)

adminAuthRouter.route('/intrest-roles').get(authenticate , getAllInterestRoles).post(authenticate,authorizeRoles('admin'), createInterestRole);
adminAuthRouter.route('/intrest-roles/:id').get(authenticate, getInterestRoleById).put(authenticate, authorizeRoles('admin'),updateInterestRole).delete(authenticate, authorizeRoles('admin') ,deleteInterestRole);

export default adminAuthRouter;