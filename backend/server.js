import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import { createServer } from "http";
import { createServer as createHttpsServer } from "https";
import fs from "fs";
import { Server } from "socket.io";
import connectDB from "./src/config/mongoose.config.js";
import indexRouter from "./src/routes/index.route.js";
import { errorHandling } from "./src/middleware/errorHandler.middleware.js";

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

// Create server (HTTP for development, HTTPS for production)
let server;
if (process.env.NODE_ENV === 'production') {
  try {
    // SSL Configuration for production
    const sslOptions = {
      key: fs.readFileSync('/etc/ssl/private/fildex.ie.key'),
      cert: fs.readFileSync('/etc/ssl/certs/fildex.ie.crt')
    };
    server = createHttpsServer(sslOptions, app);
  } catch (error) {
    console.log('SSL certificates not found, falling back to HTTP');
    server = createServer(app);
  }
} else {
  // Development - use HTTP
  server = createServer(app);
}

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174", 
      "http://localhost:5175",
      "http://46.62.206.205",
      "https://46.62.206.205", 
      "http://fildex.ie",
      "https://fildex.ie",
      "http://www.fildex.ie",
      "https://www.fildex.ie",
  ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
  allowEIO3: true, // Allow Engine.IO v3 clients
});

// Make io available globally for use in controllers
global.io = io;

app.use(helmet());
app.use(
  cors({
    origin: [
     "http://localhost:5173",
     "http://localhost:5174",
     "http://localhost:5175",
      "http://46.62.206.205",
      "https://46.62.206.205",
      "http://fildex.ie", 
      "https://fildex.ie",
      "http://www.fildex.ie",
      "https://www.fildex.ie",
    ], 
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

// Serve static files from uploads directory
app.use('/api/v1/public/uploads', express.static(path.join(__dirname, 'src/public/uploads')));

//routes
app.use("/api/v1", indexRouter);

// Error handling middleware (must be last)
app.use(errorHandling);

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Join admin room for notifications
  socket.on('join-admin', () => {
    socket.join('admin');
  });
  
  socket.on('disconnect', (reason) => {
    // Client disconnected
  });

  // Handle errors
  socket.on('error', (error) => {
    // Socket error occurred
  });
});

//server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  const apiUrl = process.env.NODE_ENV === 'production' 
    ? 'https://fildex.ie/api/v1' 
    : `http://localhost:${port}/api/v1`;
  console.log(`📡 API endpoints available at ${apiUrl}`);
  console.log(`🔌 Socket.IO server ready for connections`);
});
