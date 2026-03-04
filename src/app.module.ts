import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [AuthModule, AdminModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
