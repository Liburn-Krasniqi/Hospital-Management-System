import { PatientService } from "../services/patients.service.js";

export class PatientController {
  // @desc    Get all patients
  // @route   GET /api/patients
  static async getPatients(req, res, next) {
    try {
      // For pagination
      const skip = parseInt(req.params.skip);
      const take = parseInt(req.params.take);
      console.log(`Skip: ${skip}, Take: ${take}`);

      const patients = await PatientService.getPatients(take, skip);

      res.status(200).json(patients);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get a single patient
  // @route   GET /api/posts/:id
  static async getPatient(req, res, next) {
    const id = req.params.id;
    const patient = await PatientService.getPatient(id);

    if (!patient) {
      const error = new Error(`A patient with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }

    res.status(200).json(patient);
  }

  // @desc    Create patient
  // @route   Post /api/patients
  static async createPatient(req, res, next) {
    try {
      const data = req.body;

      const patient = await PatientService.createPatient(data);

      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update patient
  // @route   PUT /api/patients/:id
  static async updatePatient(req, res, next) {
    const id = req.params.id;

    const patient = await PatientService.getPatient(id);
    if (!patient) {
      const error = new Error(`A patient with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }
    const data = req.body;
    console.log("Controller: " + req.body); //remove laterrrr
    const updatedPatient = await PatientService.updatePatient(id, data);

    res.status(200).json(updatedPatient);
  }

  // @desc    Delete patient
  // @route   DELETE /api/patients/:id
  static async deletePatient(req, res, next) {
    const id = req.params.id; //Check later if possible to use query parameters

    const patient = await PatientService.getPatient(id);
    if (!patient) {
      const error = new Error(`A patient with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }

    const deletedPatient = await PatientService.deletePatient(id);

    res.status(200).json(deletedPatient);
  }
}
