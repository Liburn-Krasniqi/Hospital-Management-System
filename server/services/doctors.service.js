// model Doctor{
//   id String @id @default(uuid())
//   name String
//   email String @unique
//   password String
//   phone String
//   specialty String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   appointments Appointment[]
// }

import { prisma } from "../server.js";
import bcrypt from "bcrypt";

export class DoctorService {
  // Get doctors
  static async getDoctors(take, skip) {
    // const defaultPage = 0;
    // const defaultSearch = "";
    // const defaultSort = "createdAt";

    const doctorCount = await prisma.doctor.count();
    const doctors = await prisma.doctor.findMany({
      take: take || 5,
      skip: skip || 0,
    });
    return [doctors, doctorCount];
  }

  // get one patient based on id
  static async getDoctor(id) {
    return await prisma.doctor.findUnique({
      where: {
        id: id,
      },
    });
  }

  // get one patient based on email
  static async getDoctorEmail(email) {
    return await prisma.doctor.findUnique({
      where: {
        email: email,
      },
    });
  }

  // Create doctor
  static async createDoctor(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const doctor = await prisma.doctor.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        password: hashedPassword,
      },
    });

    return doctor;
  }

  // Update doctor
  static async updateDoctor(id, data) {
    console.log("Service: " + JSON.stringify(data)); //remove laterrrr
    const doctor = prisma.doctor.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        password: data.password,
      },
    });

    return doctor;
  }

  // Delete doctor
  static async deleteDoctor(id) {
    const doctor = prisma.doctor.delete({
      where: {
        id: id,
      },
    });

    return doctor;
  }
}
