import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/doctor-reports/:doctorId')
  async getReportsForDoctor(@Param('doctorId') doctorId: string) {
    return await this.reportService.fetchReportsForDoctor(doctorId);
  }

  @Post('/')
  async createDoctor(
    @Body()
    data: {
      appointmentId: number;
      condition: string;
      fullReport: string;
      remedies: string;
    },
  ) {
    return await this.reportService.createReport(data);
  }

  @Patch('/doctors')
  async updateReport(
    @Body()
    data: {
      appointmentId: number;
      condition: string;
      fullReport: string;
      remedies: string;
    },
  ) {
    return await this.reportService.updateReport(data);
  }
}
