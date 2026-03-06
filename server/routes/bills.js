import express from "express";
import { BillsController } from "../controllers/bills.controller.js";

const Bills = express.Router();

/* ─────────────── Bills ─────────────── */

// Get all bills (paginated: ?take=20&skip=0)
Bills.get("/", BillsController.getBills);

// Get a single bill
Bills.get("/id/:id", BillsController.getBill);

// Get bills for a patient
Bills.get("/patient/:id", BillsController.getPatientBills);

// Create a new bill
Bills.post("/", BillsController.createBill);

// Update a bill (e.g. mark as paid)
Bills.put("/id/:id", BillsController.updateBill);

// Delete a bill
Bills.delete("/id/:id", BillsController.deleteBill);

/* ─────────────── Services ─────────────── */

// Get all services
Bills.get("/services", BillsController.getServices);

// Get a single service
Bills.get("/services/id/:id", BillsController.getService);

// Create a service
Bills.post("/services", BillsController.createService);

// Update a service
Bills.put("/services/id/:id", BillsController.updateService);

// Delete a service
Bills.delete("/services/id/:id", BillsController.deleteService);

export { Bills };
