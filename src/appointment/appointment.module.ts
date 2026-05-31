import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { JwtUtil } from '../common/utils/jwt.util';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, JwtUtil],
})
export class AppointmentModule {}
