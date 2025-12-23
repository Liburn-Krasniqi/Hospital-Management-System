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

  // @desc    Get request of a doctor
  // @route   GET /api/appointments/requests
  static async getRequests(req, res, next) {
    try {
      const data = req.body;

      const requests =
        await AppointmentRequestService.getAppointmentRequestsByDoctorId(
          data.id
        );

      res.status(201).json(requests);
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

  // @desc    Update request
  // @route   PUT /api/appointments/requests/id/:id
  static async updateRequest(req, res, next) {
    const id = req.params.id;

    const request = await AppointmentRequestService.getAppointmentRequestById(
      id
    );
    if (!request) {
      const error = new Error(`A request with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }
    const data = req.body;

    const updatedRequest =
      await AppointmentRequestService.updateAppointmentRequestStatus(
        id,
        data.status
      );

    res.status(200).json(updatedRequest);
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
