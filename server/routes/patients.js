import express from "express";
import {
  createPatient,
  deletePatient,
  getPatients,
  updatePatient,
} from "../controllers/patients.controller.js";

const router = express.Router();

// Get all patients
router.get("/", getPatients);
// Get patients by id
router.get("/:id", getPatients);

//Create new patient
router.post("/", createPatient);

//Update a patient
router.put("/:id", updatePatient);

// Delete patient
router.delete("/:id", deletePatient);

export default router;
