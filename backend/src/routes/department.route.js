import express from 'express';
import { createDepartment, holdDepartment, reactivateDepartment, getAllDepartments, getDepartmentById, updateDepartment } from '../admin/controller/department.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const departmentRouter = express.Router();

departmentRouter.route('/')
  .get(authenticate, getAllDepartments)
  .post(authenticate, authorizeRoles("admin", "super_admin"), createDepartment);
departmentRouter.route('/:id')
  .get(authenticate, getDepartmentById)
  .put(authenticate, authorizeRoles("admin", "super_admin"), updateDepartment);
departmentRouter.route('/:id/hold')
  .put(authenticate, authorizeRoles("admin", "super_admin"), holdDepartment);
departmentRouter.route('/:id/reactivate')
  .put(authenticate, authorizeRoles("admin", "super_admin"), reactivateDepartment);

  export default  departmentRouter