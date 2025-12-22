import express from "express";
import cors from "cors";

import { logger, errorHandler, notFound } from "./middleware/index.js";

// Route imports
import { Patients, Doctors, Appointments } from "./routes/index.js";

// Use a single prisma client instance, should this be here?? // Yes it should because this file is running
import prismaInstance from "./prismaClient.js";
export const prisma = prismaInstance;

const port = process.env.PORT || 8080;

const app = express(); //this can be reduced/merged into one thing.
app.use(cors());

// Logger middleware
app.use(logger);

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //find out what this means for me?

// Routes
app.use("/api/patients", Patients);
app.use("/api/doctors", Doctors);
app.use("/api/appointments", Appointments);

// Use Error handler AFTER routes to avoid potential conflicts
app.use(notFound);
app.use(errorHandler);

// Server
app.listen(port, () => console.log(`its alive on http://localhost:${port}`));
