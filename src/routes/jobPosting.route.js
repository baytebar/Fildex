import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { createJobPosting, deleteJobPosting, getAllJobPostings, getJobPostingById, updateJobPosting } from '../admin/controller/jobPsoting.controller.js';

const jobPostingRouter = express.Router();

jobPostingRouter.route('/')
  .get(authenticate, getAllJobPostings)
  .post(authenticate, authorizeRoles("admin"), createJobPosting);
jobPostingRouter.route('/:id')
  .get(authenticate, getJobPostingById)
  .put(authenticate, authorizeRoles("admin"), updateJobPosting)
  .delete(authenticate, authorizeRoles("admin"), deleteJobPosting)

  export default  jobPostingRouter