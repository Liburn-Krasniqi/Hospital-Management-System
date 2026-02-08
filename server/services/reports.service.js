import { prisma } from "../server.js";

export class ReportService {
  static async getReports(take = 20, skip = 0) {
    const [reports, count] = await Promise.all([
      prisma.report.findMany({
        take,
        skip,
        include: {
          patient: { select: { id: true, name: true, email: true } },
          doctor: { select: { id: true, name: true, specialty: true } },
          appointment: true,
        },
        orderBy: { reportDate: "desc" },
      }),
      prisma.report.count(),
    ]);
    return [reports, count];
  }

  static async getReportById(id) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
        appointment: true,
      },
    });
  }

  static async getReportsByPatientId(patientId) {
    return prisma.report.findMany({
      where: { patientId },
      include: {
        doctor: { select: { id: true, name: true, specialty: true } },
        appointment: true,
      },
      orderBy: { reportDate: "desc" },
    });
  }

  static async getReportsByDoctorId(doctorId) {
    return prisma.report.findMany({
      where: { doctorId },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        appointment: true,
      },
      orderBy: { reportDate: "desc" },
    });
  }

  static async getReportsByAppointmentId(appointmentId) {
    return prisma.report.findMany({
      where: { appointmentId },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
      },
    });
  }

  static async createReport(data) {
    return prisma.report.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        findings: data.findings,
        recommendations: data.recommendations,
        appointmentId: data.appointmentId ?? undefined,
        reportDate: data.reportDate ? new Date(data.reportDate) : undefined,
        typeOfVisit: data.typeOfVisit ?? "CONSULTATION",
      },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
        appointment: true,
      },
    });
  }

  static async updateReport(id, data) {
    const updateData = {};
    if (data.findings !== undefined) updateData.findings = data.findings;
    if (data.recommendations !== undefined)
      updateData.recommendations = data.recommendations;
    if (data.appointmentId !== undefined)
      updateData.appointmentId = data.appointmentId;
    if (data.reportDate !== undefined)
      updateData.reportDate = new Date(data.reportDate);
    if (data.typeOfVisit !== undefined) updateData.typeOfVisit = data.typeOfVisit;

    return prisma.report.update({
      where: { id },
      data: updateData,
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
        appointment: true,
      },
    });
  }

  static async deleteReport(id) {
    return prisma.report.delete({
      where: { id },
    });
  }
}
