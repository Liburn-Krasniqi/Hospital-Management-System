import express from "express";
import { ReportController } from "../controllers/reports.controller.js";

const Reports = express.Router();

// Get report by id (specific routes first to avoid conflict with :take-:skip)
Reports.get("/id/:id", ReportController.getReport);

// Get reports by patient id
Reports.get("/patient/:id", ReportController.getPatientReports);

// Get reports by doctor id
Reports.get("/doctor/:id", ReportController.getDoctorReports);

// Get reports by appointment id
Reports.get("/appointment/:id", ReportController.getAppointmentReports);

// Get all reports (paginated)
Reports.get("/:take-:skip", ReportController.getReports);

// Create report
Reports.post("/", ReportController.createReport);

// Update report
Reports.put("/id/:id", ReportController.updateReport);

// Delete report
Reports.delete("/id/:id", ReportController.deleteReport);

export { Reports };
