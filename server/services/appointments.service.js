// model Appointment{
//   id String @id @default(uuid())
//   patientId String
//   doctorId String
//   appointmentStartTime DateTime
//   appointmentEndTime DateTime
//   reason String?
//   status String @default("scheduled") // e.g., scheduled, completed, canceled
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   patient Patient @relation(fields: [patientId], references: [id])
//   doctor Doctor @relation(fields: [doctorId], references: [id])

// it takes the id of doctors via auth provider on front?
// patient via frontend input or smth

import { prisma } from "../server.js";

export class AppointmentService {
  // get appointments by doctor id
  static async getAppointmentsByDoctorId(id) {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
      },
      include: {
        patient: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { appointmentStartTime: "asc" },
    });

    return appointments;
  }

  // get appointments by id
  static async getAppointmentById(id) {
    const appointments = await prisma.appointment.findUnique({
      where: {
        id: id,
      },
    });

    return appointments;
  }

  //

  // create appointment (after request approved)
  static async createAppointment(data) {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        appointmentStartTime: data.appointmentStartTime,
        appointmentEndTime: data.appointmentEndTime,
        reason: data.reason,
      },
    });

    return appointment;
  }

  // Update appointment
  static async updateAppointment(id, data) {
    const appointment = await prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        appointmentStartTime: data.appointmentStartTime,
        appointmentEndTime: data.appointmentEndTime,
        reason: data.reason,
        status: data.status, // usually this will change
      },
    });

    return appointment;
  }

  // Delete appointment
  static async deleteAppointment(id) {
    const appointment = await prisma.appointment.delete({
      where: {
        id: id,
      },
    });

    return appointment;
  }
}
