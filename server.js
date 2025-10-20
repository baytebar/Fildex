import express from "express";
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import helmet from "helmet";
import connectDB from "./src/config/mongoose.config.js";
import indexRouter from "./src/routes/index.route.js";

dotenv.config();
const app = express();

app.use(helmet());
// app.use(cors({
//     origin: 'http://localhost:3000', // change it to FE link
//     credentials: true,
// }))
app.use(cors());
app.use(express.json())

// Parse URL-encoded payloads (optional, for simple form-data)
app.use(express.urlencoded({ extended: true }));

connectDB();



//routes
app.use("/api/v1", indexRouter);

//server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
})