import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EncryptUtil } from '../common/utils/encrypt.util';

@Module({
  controllers: [AdminController],
  providers: [AdminService, EncryptUtil],
})
export class AdminModule {}
