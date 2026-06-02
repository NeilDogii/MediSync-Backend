import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

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
