import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { MiscService } from './misc.service';
import { Prisma } from '@prisma/client';

@Controller('misc')
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Get('doctor/:doctorId')
  async getDoctor(@Param('doctorId') doctorId: string) {
    const doctorIdNum = parseInt(doctorId, 10);
    if (isNaN(doctorIdNum)) {
      throw new HttpException('Invalid doctor ID', HttpStatus.BAD_REQUEST);
    }
    return await this.miscService.fetchDoctor(doctorIdNum);
  }

  @Get('doctor-dashboard/:doctorId')
  async getDoctorDashboard(@Param('doctorId') doctorId: string) {
    const doctorIdNum = parseInt(doctorId, 10);
    if (isNaN(doctorIdNum)) {
      throw new HttpException('Invalid doctor ID', HttpStatus.BAD_REQUEST);
    }
    return await this.miscService.fetchDoctorDashboard(doctorIdNum);
  }

  @Patch('doctor-settings/:doctorId')
  async updateDoctorSettings(
    @Param('doctorId') doctorId: string,
    @Body() settings: Prisma.DoctorUpdateInput,
  ) {
    const doctorIdNum = parseInt(doctorId, 10);
    if (isNaN(doctorIdNum)) {
      throw new HttpException('Invalid doctor ID', HttpStatus.BAD_REQUEST);
    }
    return await this.miscService.updateDoctorSettings(doctorIdNum, settings);
  }
}
