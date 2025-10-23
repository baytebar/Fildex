import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./src/config/mongoose.config.js";
import indexRouter from "./src/routes/index.route.js";
import { errorHandling } from "./src/middleware/errorHandler.middleware.js";

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://46.62.206.205", // server IP
      "http://fildex.ie", // domain
      "http://www.fildex.ie",
    ], // Vite default ports
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Removed duplicate cors() call that was overriding the configuration above
app.use(express.json());

// Parse URL-encoded payloads (optional, for simple form-data)
app.use(express.urlencoded({ extended: true }));

connectDB().catch((err) => {
  process.exit(1);
});

//routes
app.use("/api/v1", indexRouter);

// Error handling middleware (must be last)
app.use(errorHandling);

//server
const port = process.env.PORT || 5000;
app.listen(port, () => {});
