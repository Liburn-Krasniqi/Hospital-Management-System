import express from "express";
import { PatientController } from "../controllers/patients.controller.js";

const Patients = express.Router();

// Get all patients
Patients.get("/:take-:skip", PatientController.getPatients);

// Get patients by id
Patients.get("/id/:id", PatientController.getPatient);

//Create new patient
Patients.post("/", PatientController.createPatient);

// Log In
Patients.post("/login", PatientController.authenticatePatient);

//Update a patient
Patients.put("/id/:id", PatientController.updatePatient);

// Delete patient
Patients.delete("/id/:id", PatientController.deletePatient);

export { Patients };
