import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import type { Appointment } from '@prisma/client';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('/')
  async fetchAppointments(@Body('doctorId') doctorId?: string) {
    return await this.appointmentService.fetchAppointments({ doctorId });
  }

  @Get('/:id')
  async getAppointment(@Body('id') doctorId: string) {
    return await this.appointmentService.fetchAppointments({ doctorId });
  }

  @Get('/patients/:doctorId')
  async fetchPatients(@Param('doctorId') doctorId: string) {
    return await this.appointmentService.fetchPatients({ doctorId });
  }

  @Get('/patient-appointments/:patientId')
  async fetchPatientAppointments(@Param('patientId') patientId: string) {
    return await this.appointmentService.fetchPatientAppointments({
      patientId,
    });
  }

  @Post('/')
  async createAppointment(@Body() data: Appointment) {
    return await this.appointmentService.createAppointment(data);
  }

  @Post('/meeting-token')
  async createMeetingToken(
    @Body()
    {
      appointmentId,
      type,
    }: {
      appointmentId: number;
      type: 'doctor' | 'patient';
    },
  ) {
    return await this.appointmentService.createMeetingToken({
      appointmentId,
      type,
    });
  }

  @Patch('/:id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() data: Partial<Appointment>,
  ) {
    return await this.appointmentService.updateAppointment({ id, data });
  }
}
