import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PeerModule } from './peer/peer.module';
import { ReportModule } from './report/report.module';
import { MiscModule } from './misc/misc.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [AuthModule, AdminModule, AiModule, AppointmentModule, PeerModule, ReportModule, MiscModule, DoctorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
