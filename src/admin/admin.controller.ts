import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Prisma } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Doctor Management
  @Get('/doctors')
  async getDoctors() {
    return await this.adminService.fetchDoctors();
  }

  @Post('/doctors')
  async createDoctor(@Body() data: Prisma.DoctorCreateInput) {
    return await this.adminService.createDoctor({ data });
  }

  @Patch('/doctors/:id')
  async updateDoctor(
    @Body() data: Prisma.DoctorUpdateInput,
    @Param('id') id: string,
  ) {
    return await this.adminService.updateDoctor({ id, data });
  }

  @Delete('/doctors/:id')
  async deleteDoctor(@Param('id') id: string) {
    return await this.adminService.deleteDoctor(id);
  }

  // PATIENT MANAGEMENT
  @Get('/patients')
  async getPatients() {
    return await this.adminService.fetchPatients();
  }
}
