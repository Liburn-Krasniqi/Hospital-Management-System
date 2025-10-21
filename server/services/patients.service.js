import { prisma } from "../server.js";

export class PatientService {
  // Get patients
  static async getPatients(data) {
    // const defaultPage = 0;
    // const defaultSearch = "";
    // const defaultSort = "createdAt";
    const defaultLimit = 5;
    const defaultOffset = 0;

    return await prisma.patient.findMany({
      take: data.take || defaultLimit,
      skip: data.skip || defaultOffset,
    });
  }

  // Create patient
  static async createPatient(data) {
    const patient = await prisma.patient.create({
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

    console.log(`Successfuly deleted patient with id: ${id}`);
    return patient;
  }
}
