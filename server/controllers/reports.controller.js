import { ReportService } from "../services/reports.service.js";

export class ReportController {
  // @desc    Get all reports (paginated)
  // @route   GET /api/reports/:take-:skip
  static async getReports(req, res, next) {
    try {
      const take = parseInt(req.params.take) || 20;
      const skip = parseInt(req.params.skip) || 0;
      const [reports, count] = await ReportService.getReports(take, skip);
      res.status(200).json({ reports, count });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get report by id
  // @route   GET /api/reports/id/:id
  static async getReport(req, res, next) {
    try {
      const id = req.params.id;
      const report = await ReportService.getReportById(id);
      if (!report) {
        const error = new Error(`A report with the id of ${id} was not found`);
        error.status = 404;
        return next(error);
      }
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get reports by patient id
  // @route   GET /api/reports/patient/:id
  static async getPatientReports(req, res, next) {
    try {
      const id = req.params.id;
      const reports = await ReportService.getReportsByPatientId(id);
      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get reports by doctor id
  // @route   GET /api/reports/doctor/:id
  static async getDoctorReports(req, res, next) {
    try {
      const id = req.params.id;
      const reports = await ReportService.getReportsByDoctorId(id);
      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get reports by appointment id
  // @route   GET /api/reports/appointment/:id
  static async getAppointmentReports(req, res, next) {
    try {
      const id = req.params.id;
      const reports = await ReportService.getReportsByAppointmentId(id);
      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create report
  // @route   POST /api/reports
  static async createReport(req, res, next) {
    try {
      const data = req.body;
      const report = await ReportService.createReport(data);
      res.status(201).json(report);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update report
  // @route   PUT /api/reports/id/:id
  static async updateReport(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;

      const existing = await ReportService.getReportById(id);
      if (!existing) {
        const error = new Error(`A report with the id of ${id} was not found`);
        error.status = 404;
        return next(error);
      }

      const report = await ReportService.updateReport(id, data);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete report
  // @route   DELETE /api/reports/id/:id
  static async deleteReport(req, res, next) {
    try {
      const id = req.params.id;

      const existing = await ReportService.getReportById(id);
      if (!existing) {
        const error = new Error(`A report with the id of ${id} was not found`);
        error.status = 404;
        return next(error);
      }

      const report = await ReportService.deleteReport(id);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }
}
