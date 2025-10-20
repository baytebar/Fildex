import express from 'express';
import path from 'path'
import { fileURLToPath } from "url";
import userRouter from './user.route.js';
import adminAuthRouter from './adminAuth.route.js';
import departmentRouter from './department.route.js';
import jobPostingRouter from './jobPosting.route.js';
import resumeRouter from './resume.route.js';

const indexRouter = express.Router();

// Serve the uploads folder statically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
indexRouter.use("/public/uploads", express.static(path.join(__dirname, "../public/uploads")));

//admin routes
indexRouter.use('/admin', adminAuthRouter)

//user routes
indexRouter.use('/user', userRouter)

//departmentRouter
indexRouter.use('/admin/departments' , departmentRouter)

//jobposting router
indexRouter.use('/job-posting', jobPostingRouter)

//resume router
indexRouter.use('/resume', resumeRouter)

export default indexRouter;