import { prisma } from "../server.js";

export class ServiceService {
  static async getServices() {
    return prisma.service.findMany({ orderBy: { name: "asc" } });
  }

  static async getServiceById(id) {
    return prisma.service.findUnique({ where: { id } });
  }

  static async createService(data) {
    return prisma.service.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
      },
    });
  }

  static async updateService(id, data) {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;

    return prisma.service.update({ where: { id }, data: updateData });
  }

  static async deleteService(id) {
    return prisma.service.delete({ where: { id } });
  }
}
