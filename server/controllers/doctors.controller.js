import { DoctorService, Auth } from "../services/index.js";
import bcrypt from "bcrypt";

export class DoctorController {
  // @desc    Get all doctors
  // @route   GET /api/doctors
  static async getDoctors(req, res, next) {
    try {
      // For pagination
      const skip = parseInt(req.params.skip);
      const take = parseInt(req.params.take);
      console.log(`Skip: ${skip}, Take: ${take}`);

      const doctors = await DoctorService.getDoctors(take, skip);

      res.status(200).json(doctors);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get a single doctor
  // @route   GET /api/doctors/:id
  static async getDoctor(req, res, next) {
    const id = req.params.id;
    const doctor = await DoctorService.getDoctor(id);

    if (!doctor) {
      const error = new Error(`A patient with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }

    res.status(200).json(doctor);
  }

  // @desc    Create doctor
  // @route   Post /api/doctors
  static async createDoctor(req, res, next) {
    try {
      const data = req.body;

      const patient = await DoctorService.createDoctor(data);

      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update doctor
  // @route   PUT /api/doctors/:id
  static async updateDoctor(req, res, next) {
    const id = req.params.id;

    const doctor = await DoctorService.getDoctor(id);
    if (!doctor) {
      const error = new Error(`A doctor with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }
    const data = req.body;
    console.log("Controller: " + req.body); //remove laterrrr
    const updatedDoctor = await DoctorService.updateDoctor(id, data);

    res.status(200).json(updatedDoctor);
  }

  // @desc    Delete doctor
  // @route   DELETE /api/doctors/:id
  static async deleteDoctor(req, res, next) {
    const id = req.params.id; //Check later if possible to use query parameters

    const doctor = await DoctorService.getDoctor(id);
    if (!doctor) {
      const error = new Error(`A patient with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }

    const deletedDoctor = await DoctorService.deleteDoctor(id);

    res.status(200).json(deletedDoctor);
  }

  // @desc    Log In doctor
  // @route   Post /api/doctor/login
  static async authenticateDoctor(req, res, next) {
    try {
      const data = req.body;

      const doctor = await DoctorService.getDoctorEmail(data.email);

      if (doctor === null) {
        return res.status(400).send("Cannot find Doctor");
      }

      // check if pw is valid
      if (await bcrypt.compare(data.password, doctor.password)) {
        // Generate tokens
        const [accessToken, refreshToken] = Auth.generateTokens({
          // trying to not send the whole patient as to make the token smaller
          email: doctor.email,
          name: doctor.name,
        });

        res.status(200).json({
          name: doctor.name,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        res.status(401).send("Not Allowed!");
      }
      //
    } catch (error) {
      next(error);
    }
  }
}
