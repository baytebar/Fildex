import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { createJobPosting, deleteJobPosting, getAllJobPostings, getJobPostingById, updateJobPosting, pauseJobPosting, resumeJobPosting } from '../admin/controller/jobPosting.controller.js';

const jobPostingRouter = express.Router();

jobPostingRouter.route('/')
  .get(authenticate, getAllJobPostings)
  .post(authenticate, authorizeRoles("admin", "super_admin"), createJobPosting);
jobPostingRouter.route('/:id')
  .get(authenticate, getJobPostingById)
  .put(authenticate, authorizeRoles("admin", "super_admin"), updateJobPosting)
  .delete(authenticate, authorizeRoles("admin", "super_admin"), deleteJobPosting);
jobPostingRouter.route('/:id/pause')
  .put(authenticate, authorizeRoles("admin", "super_admin"), pauseJobPosting);
jobPostingRouter.route('/:id/resume')
  .put(authenticate, authorizeRoles("admin", "super_admin"), resumeJobPosting);

export default jobPostingRouter