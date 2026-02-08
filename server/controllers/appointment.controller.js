import {
  AppointmentService,
  AppointmentRequestService,
} from "../services/index.js";

export class AppointmentController {
  /* ---------------Appointments--------------- */

  // @desc    Create appointment
  // @route   Post /api/appointments
  static async createAppointment(req, res, next) {
    try {
      const data = req.body;

      const appointment = await AppointmentService.createAppointment(data);

      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create appointment
  // @route   PUT /api/appointments
  static async updateAppointment(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;

      const appointment = await AppointmentService.updateAppointment(id, data);

      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get appointments of a doctor
  // @route   GET /api/appointments/id/:id
  static async getAppointments(req, res, next) {
    try {
      const id = req.params.id;

      const appointments = await AppointmentService.getAppointmentsByDoctorId(
        id
      );

      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get appointments of a patient
  // @route   GET /api/appointments/patient/:id
  static async getPatientAppointments(req, res, next) {
    try {
      const id = req.params.id;

      const appointments =
        await AppointmentService.getAppointmentsByPatientId(id);

      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get appointment by id
  // @route   GET /api/appointments/:id
  static async getAppointment(req, res, next) {
    try {
      const id = req.params.id;

      const appointment = await AppointmentService.getAppointmentById(id);

      res.status(200).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update request
  // @route   PUT /api/appointments/requests/:id
  static async deleteAppointment(req, res, next) {
    const id = req.params.id;

    const appointment = await AppointmentService.getAppointmentById(id);
    if (!appointment) {
      const error = new Error(
        `An appointment with the id of ${id} was not found`
      );
      error.status = 404;
      return next(error);
    }

    const deletedAppointment = await AppointmentService.deleteAppointment(id);

    res.status(200).json(deletedAppointment);
  }

  /* ---------------Appointment Requests--------------- */

  // @desc    Get requests - by doctor (?doctorId=xxx) or by patient (?patientId=xxx)
  // @route   GET /api/appointments/requests?doctorId=xxx | ?patientId=xxx
  static async getRequests(req, res, next) {
    try {
      const doctorId = req.query.doctorId;
      const patientId = req.query.patientId;

      if (doctorId) {
        const requests =
          await AppointmentRequestService.getAppointmentRequestsByDoctorId(
            doctorId
          );
        return res.status(200).json(requests);
      }
      if (patientId) {
        const requests =
          await AppointmentRequestService.getAppointmentRequestsByPatientId(
            patientId
          );
        return res.status(200).json(requests);
      }
      return res.status(400).json({
        message: "doctorId or patientId query parameter is required",
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create request
  // @route   Post /api/appointments/requests
  static async requestAppointment(req, res, next) {
    try {
      const data = req.body;

      const request = await AppointmentRequestService.createAppointmentRequest(
        data
      );

      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update request (approve/deny). Approving creates an Appointment.
  // @route   PUT /api/appointments/requests/id/:id
  static async updateRequest(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;

      const request = await AppointmentRequestService.getAppointmentRequestById(
        id
      );
      if (!request) {
        const error = new Error(`A request with the id of ${id} was not found`);
        error.status = 404;
        return next(error);
      }

      const status = (data.status || "").toLowerCase();
      if (status !== "approved" && status !== "rejected") {
        return res.status(400).json({
          message: "status must be 'approved' or 'rejected'",
        });
      }

      const updatedRequest =
        await AppointmentRequestService.updateAppointmentRequestStatus(
          id,
          status
        );

      if (status === "approved") {
        const startTime = new Date(request.requestedDate);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
        await AppointmentService.createAppointment({
          patientId: request.patientId,
          doctorId: request.doctorId,
          appointmentStartTime: startTime,
          appointmentEndTime: endTime,
          reason: request.reason || undefined,
        });
      }

      res.status(200).json(updatedRequest);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update request
  // @route   PUT /api/appointments/requests/:id
  static async deleteAppointmentRequest(req, res, next) {
    const id = req.params.id;

    const request = await AppointmentRequestService.getAppointmentRequestById(
      id
    );
    if (!request) {
      const error = new Error(`A request with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }

    const deletedRequest = await AppointmentRequestService.deleteRequest(id);

    res.status(200).json(deletedRequest);
  }
}
