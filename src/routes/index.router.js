import express from 'express';
import path from 'path'
import { fileURLToPath } from "url";
import userRouter from './user.router.js';
import adminAuthRouter from './adminAuth.router.js';

const indexRouter = express.Router();

// Serve the uploads folder statically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
indexRouter.use("/public/uploads", express.static(path.join(__dirname, "../public/uploads")));

//admin routes
indexRouter.use('/admin', adminAuthRouter)

//user routes
indexRouter.use('/user', userRouter)

export default indexRouter;