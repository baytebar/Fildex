import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import helmet from "helmet";
import connectDB from "./src/config/mongoose.config.js";
import indexRouter from "./src/routes/index.router.js";

dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite default port and React default port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())

// Parse URL-encoded payloads (optional, for simple form-data)
app.use(express.urlencoded({ extended: true }));

connectDB();

// Serve static files from uploads directory
app.use('/api/v1/public', express.static(path.join(__dirname, 'src/public')));

//routes
app.use("/api/v1", indexRouter);

//server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
})