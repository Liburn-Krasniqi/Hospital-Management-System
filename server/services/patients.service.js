import { prisma } from "../server.js";
import bcrypt from "bcrypt";
export class PatientService {
  // Get patients
  static async getPatients(take, skip) {
    // const defaultPage = 0;
    // const defaultSearch = "";
    // const defaultSort = "createdAt";

    const patientCount = await prisma.patient.count();
    const patients = await prisma.patient.findMany({
      take: take || 5,
      skip: skip || 0,
    });
    return [patients, patientCount];
  }

  // get one patient based on id
  static async getPatient(id) {
    return await prisma.patient.findUnique({
      where: {
        id: id,
      },
    });
  }

  // get one patient based on email
  static async getPatientEmail(email) {
    return await prisma.patient.findUnique({
      where: {
        email: email,
      },
    });
  }

  // Create patient
  static async createPatient(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const patient = await prisma.patient.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        address: data.address,
        password: hashedPassword,
      },
    });

    return patient;
  }

  // Update patient
  static async updatePatient(id, data) {
    const patient = prisma.patient.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        address: data.address,
        password: data.password,
      },
    });

    return patient;
  }

  // Delete patient
  static async deletePatient(id) {
    const patient = prisma.patient.delete({
      where: {
        id: id,
      },
    });
    return patient;
  }
}
