import express from "express";
import { PatientController } from "../controllers/patients.controller.js";

const router = express.Router();

// Get all patients
router.get("/:take-:skip", PatientController.getPatients);

// Get patients by id
router.get("/id/:id", PatientController.getPatient);

//Create new patient
router.post("/", PatientController.createPatient);

//Update a patient
router.put("/id/:id", PatientController.updatePatient);

// Delete patient
router.delete("/id/:id", PatientController.deletePatient);

export default router;
