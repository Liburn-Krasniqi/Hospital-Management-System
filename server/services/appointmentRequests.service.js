// model AppointmentRequest{
//   id String @id @default(uuid())
//   patientId String
//   doctorId String
//   requestedDate DateTime
//   reason String?
//   status String @default("pending") // e.g., pending, approved, rejected
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   // Uncomment the following lines if you want to establish relations
//   // patient Patient @relation(fields: [patientId], references: [id])
//   // doctor Doctor @relation(fields: [doctorId], references: [id])
// }

// it takes the id of patients via auth provider on front?
// doctor via selection

import { prisma } from "../server.js";

export class AppointmentRequestService {
  // create appointment (after request approved)
  static async createAppointmentRequest(data) {
    const appointmentRequest = await prisma.appointmentRequest.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        requestedDate: data.requestedDate,
        reason: data.reason,
      },
    });

    return appointmentRequest;
  }

  // Update appointment
  static async updateAppointmentRequestStatus(id, status) {
    const appointmentRequest = await prisma.appointmentRequest.update({
      where: {
        id: id,
      },
      data: {
        status: status, // usually this will change
      },
    });

    return appointmentRequest;
  }

  // find appointment request
  static async getAppointmentRequestById(id) {
    const appointmentRequest = await prisma.appointmentRequest.findUnique({
      where: {
        id: id,
      },
    });

    return appointmentRequest;
  }

  // find appointment request by doctor
  static async getAppointmentRequestsByDoctorId(id) {
    const appointmentRequests = await prisma.appointmentRequest.findMany({
      where: {
        doctorId: id,
      },
    });

    return appointmentRequests;
  }

  static async deleteRequest(id) {
    const deletedRequest = await prisma.appointmentRequest.delete({
      where: {
        id: id,
      },
    });

    return deletedRequest;
  }
}
