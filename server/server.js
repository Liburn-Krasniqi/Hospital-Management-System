import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Middleware (check later if possible to import all in one line)
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";
import notFound from "./middleware/notFound.js";
// Route imports
import posts from "./routes/posts.js";
import patients from "./routes/patients.js";
// Use a single prisma client instance, should this be here?? // Yes it should because this file is running
import prismaInstance from "./prismaClient.js";
export const prisma = prismaInstance;
const port = process.env.PORT || 8080;

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:5173"], // Whitelist the domains you want to allow
};

// GET the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); //this can be reduced/merged into one thing.

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Logger middleware
app.use(logger);

//setup static folder
app.use(express.static(path.join(__dirname, "public")));

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/posts", posts);
app.use("/api/patients", patients);

// Use Error handler AFTER routes to avoid potential conflicts
app.use(notFound);
app.use(errorHandler);

// Server
app.listen(port, () => console.log(`its alive on http://localhost:${port}`));
