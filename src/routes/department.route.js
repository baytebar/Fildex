import express from 'express';
import { createDepartment, deleteDepartment, getAllDepartments, getDepartmentById, updateDepartment } from '../admin/controller/department.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const departmentRouter = express.Router();

departmentRouter.route('/')
  .get(authenticate, getAllDepartments)
  .post(authenticate, authorizeRoles("admin"), createDepartment);
departmentRouter.route('/:id')
  .get(authenticate, getDepartmentById)
  .put(authenticate, authorizeRoles("admin"), updateDepartment)
  .delete(authenticate, authorizeRoles("admin"), deleteDepartment)

  export default  departmentRouter