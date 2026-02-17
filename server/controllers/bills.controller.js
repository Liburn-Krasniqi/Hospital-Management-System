import { BillService, ServiceService } from "../services/index.js";

export class BillsController {
  // ── Bills ────────────────────────────────────────────────

  // @desc    Get all bills (paginated)
  // @route   GET /api/bills?take=20&skip=0
  static async getBills(req, res, next) {
    try {
      const take = parseInt(req.query.take) || 20;
      const skip = parseInt(req.query.skip) || 0;

      const [bills, count] = await BillService.getBills(take, skip);

      res.status(200).json({ bills, total: count });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single bill by id
  // @route   GET /api/bills/id/:id
  static async getBill(req, res, next) {
    try {
      const bill = await BillService.getBillById(req.params.id);
      if (!bill) {
        const error = new Error(
          `Bill with id ${req.params.id} was not found`
        );
        error.status = 404;
        return next(error);
      }
      res.status(200).json(bill);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get bills for a patient
  // @route   GET /api/bills/patient/:id
  static async getPatientBills(req, res, next) {
    try {
      const bills = await BillService.getBillsByPatientId(req.params.id);
      res.status(200).json(bills);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create a new bill
  // @route   POST /api/bills
  static async createBill(req, res, next) {
    try {
      const { patientId, serviceId, amount, dueDate } = req.body;

      if (!patientId || !serviceId || !dueDate) {
        const error = new Error(
          "patientId, serviceId, and dueDate are required"
        );
        error.status = 400;
        return next(error);
      }

      // If no explicit amount, use the service's set price
      let finalAmount = amount;
      if (finalAmount === undefined || finalAmount === null) {
        const service = await ServiceService.getServiceById(serviceId);
        if (!service) {
          const error = new Error(
            `Service with id ${serviceId} was not found`
          );
          error.status = 404;
          return next(error);
        }
        finalAmount = service.price;
      }

      const bill = await BillService.createBill({
        ...req.body,
        amount: finalAmount,
      });

      res.status(201).json(bill);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update a bill (e.g. mark as paid)
  // @route   PUT /api/bills/id/:id
  static async updateBill(req, res, next) {
    try {
      const existing = await BillService.getBillById(req.params.id);
      if (!existing) {
        const error = new Error(
          `Bill with id ${req.params.id} was not found`
        );
        error.status = 404;
        return next(error);
      }

      const bill = await BillService.updateBill(req.params.id, req.body);
      res.status(200).json(bill);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete a bill
  // @route   DELETE /api/bills/id/:id
  static async deleteBill(req, res, next) {
    try {
      const existing = await BillService.getBillById(req.params.id);
      if (!existing) {
        const error = new Error(
          `Bill with id ${req.params.id} was not found`
        );
        error.status = 404;
        return next(error);
      }

      const deleted = await BillService.deleteBill(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      next(error);
    }
  }

  // ── Services ─────────────────────────────────────────────

  // @desc    Get all services
  // @route   GET /api/bills/services
  static async getServices(req, res, next) {
    try {
      const services = await ServiceService.getServices();
      res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single service
  // @route   GET /api/bills/services/id/:id
  static async getService(req, res, next) {
    try {
      const service = await ServiceService.getServiceById(req.params.id);
      if (!service) {
        const error = new Error(
          `Service with id ${req.params.id} was not found`
        );
        error.status = 404;
        return next(error);
      }
      res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create a service
  // @route   POST /api/bills/services
  static async createService(req, res, next) {
    try {
      const { name, price } = req.body;
      if (!name || price === undefined) {
        const error = new Error("name and price are required");
        error.status = 400;
        return next(error);
      }

      const service = await ServiceService.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update a service
  // @route   PUT /api/bills/services/id/:id
  static async updateService(req, res, next) {
    try {
      const existing = await ServiceService.getServiceById(req.params.id);
      if (!existing) {
        const error = new Error(
          `Service with id ${req.params.id} was not found`
        );
        error.status = 404;
        return next(error);
      }

      const service = await ServiceService.updateService(
        req.params.id,
        req.body
      );
      res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete a service
  // @route   DELETE /api/bills/services/id/:id
  static async deleteService(req, res, next) {
    try {
      const existing = await ServiceService.getServiceById(req.params.id);
      if (!existing) {
        const error = new Error(
          `Service with id ${req.params.id} was not found`
        );
        error.status = 404;
        return next(error);
      }

      const deleted = await ServiceService.deleteService(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      next(error);
    }
  }
}
