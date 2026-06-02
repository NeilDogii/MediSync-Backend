import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { database } from '../common/utils/database.util';

@Injectable()
export class ReportService {
  async fetchReportsForDoctor(doctorId: string) {
    if (!doctorId || isNaN(Number(doctorId))) {
      throw new HttpException('Doctor ID is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const reports = await database.report.findMany({
        where: {
          appointment: {
            doctorId: Number(doctorId),
          },
        },
      });
      return reports;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch reports' + JSON.stringify(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createReport({
    appointmentId,
    condition,
    fullReport,
    remedies,
  }: {
    appointmentId: number;
    condition: string;
    fullReport: string;
    remedies: string;
  }) {
    if (!appointmentId) {
      throw new HttpException(
        'Appointment ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log({
      appointmentId,
      condition,
      fullReport,
      remedies,
    });
    try {
      const report = await database.report.create({
        data: {
          appointmentId: appointmentId,
          condition,
          fullReport,
          remedies,
        },
      });
      return report;
    } catch (error) {
      throw new HttpException(
        'Failed to create report' + JSON.stringify(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateReport({ appointmentId, condition, fullReport, remedies }) {
    if (!appointmentId || isNaN(Number(appointmentId))) {
      throw new HttpException(
        'Appointment ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const report = await database.report.update({
        where: {
          appointmentId: Number(appointmentId),
        },
        data: {
          condition,
          fullReport,
          remedies,
        },
      });
      return report;
    } catch (error) {
      throw new HttpException(
        'Failed to create report' + JSON.stringify(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
