import { prisma } from "../server.js";

export class BillService {
  // ── Queries ──────────────────────────────────────────────

  static async getBills(take = 20, skip = 0) {
    const [bills, count] = await Promise.all([
      prisma.bill.findMany({
        take,
        skip,
        include: {
          patient: { select: { id: true, name: true, email: true } },
          service: true,
        },
        orderBy: { billingDate: "desc" },
      }),
      prisma.bill.count(),
    ]);
    return [bills, count];
  }

  static async getBillById(id) {
    return prisma.bill.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        service: true,
      },
    });
  }

  static async getBillsByPatientId(patientId) {
    return prisma.bill.findMany({
      where: { patientId },
      include: { service: true },
      orderBy: { billingDate: "desc" },
    });
  }

  // ── Mutations ────────────────────────────────────────────

  static async createBill(data) {
    return prisma.bill.create({
      data: {
        patientId: data.patientId,
        serviceId: data.serviceId,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        billingDate: data.billingDate
          ? new Date(data.billingDate)
          : undefined,
        status: data.status ?? "unpaid",
      },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        service: true,
      },
    });
  }

  static async updateBill(id, data) {
    const updateData = {};
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.serviceId !== undefined) updateData.serviceId = data.serviceId;

    return prisma.bill.update({
      where: { id },
      data: updateData,
      include: {
        patient: { select: { id: true, name: true, email: true } },
        service: true,
      },
    });
  }

  static async deleteBill(id) {
    return prisma.bill.delete({ where: { id } });
  }
}
