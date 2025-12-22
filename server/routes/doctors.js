import express from "express";
import { DoctorController } from "../controllers/doctors.controller.js";

const Doctors = express.Router();

// Get all doctors
Doctors.get("/:take-:skip", DoctorController.getDoctors);

// // Get doctors by id
Doctors.get("/id/:id", DoctorController.getDoctor);

// //Create new doctor
Doctors.post("/", DoctorController.createDoctor);

// // Log In doctor
Doctors.post("/login", DoctorController.authenticateDoctor);

// //Update a doctor
Doctors.put("/id/:id", DoctorController.updateDoctor);

// // Delete doctor
Doctors.delete("/id/:id", DoctorController.deleteDoctor);

export { Doctors };
