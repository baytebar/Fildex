import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { 
  createJobTitle, 
  getAllJobTitles, 
  getActiveJobTitles,
  getJobTitleById, 
  updateJobTitle, 
  deleteJobTitle,
  pauseJobTitle,
  resumeJobTitle
} from '../admin/controller/jobTitle.controller.js';

const jobTitleRouter = express.Router();

// Public route for active job titles (for job posting form)
jobTitleRouter.route('/active')
  .get(getActiveJobTitles);

// Admin routes (require authentication)
jobTitleRouter.route('/')
  .get(authenticate, authorizeRoles("admin"), getAllJobTitles)
  .post(authenticate, authorizeRoles("admin"), createJobTitle);

jobTitleRouter.route('/:id')
  .get(authenticate, authorizeRoles("admin"), getJobTitleById)
  .put(authenticate, authorizeRoles("admin"), updateJobTitle)
  .delete(authenticate, authorizeRoles("admin"), deleteJobTitle);

jobTitleRouter.route('/:id/pause')
  .put(authenticate, authorizeRoles("admin"), pauseJobTitle);

jobTitleRouter.route('/:id/resume')
  .put(authenticate, authorizeRoles("admin"), resumeJobTitle);

export default jobTitleRouter;
