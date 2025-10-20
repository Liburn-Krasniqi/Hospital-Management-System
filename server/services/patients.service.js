import { prisma } from "../server.js";

export class PatientService {
  // Get patients
  static async getPatients(take, skip) {
    // Validate for pagination
    const isTakeValid = !isNaN(take) && take > 0;
    const isSkipValid = !isNaN(skip) && skip > 0;

    if (!isTakeValid && isSkipValid) {
      // Only skip
      return await prisma.patient.findMany({
        skip: skip, // Specify how many you want to skip
      });
    } else if (isTakeValid && !isSkipValid) {
      // Only take
      return await prisma.patient.findMany({
        take: take, // Specify how many you want to take
      });
    } else if (isTakeValid && isSkipValid) {
      // both
      return await prisma.patient.findMany({
        take: take,
        skip: skip,
      });
    }

    return await prisma.patient.findMany({});
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
