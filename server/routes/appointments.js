import express from "express";
import { AppointmentController } from "../controllers/appointment.controller.js";

const Appointments = express.Router();

/* ---------------Appointments--------------- */

// Get all appointments
// Appointments.get("/", AppointmentController.getAppointments);

// Get appointments by doctor id
Appointments.get("/id/:id", AppointmentController.getAppointments);

// Get appointments by patient id
Appointments.get("/patient/:id", AppointmentController.getPatientAppointments);

//Create new appointment (only when doctor approves request)
Appointments.post("/", AppointmentController.createAppointment);

//Update a appointment
Appointments.put("/id/:id", AppointmentController.updateAppointment);

// Delete appointment
Appointments.delete("/id/:id", AppointmentController.deleteAppointment);

/* ---------------Appointment Requests--------------- */

// Get appointment requests by doctor id (query: ?doctorId=xxx)
Appointments.get("/requests", AppointmentController.getRequests);

//Create new appointment (only when doctor approves request)
Appointments.post("/requests", AppointmentController.requestAppointment);

//Create new appointment (only when doctor approves request)
Appointments.put("/requests/id/:id", AppointmentController.updateRequest);

// Delete appointment request
Appointments.delete(
  "/requests/id/:id", // uri
  AppointmentController.deleteAppointmentRequest
);

export { Appointments };
