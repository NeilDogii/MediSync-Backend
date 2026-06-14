import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MiscService } from './misc.service';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadBufferToCloudinary } from '../common/utils/upload.util';

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

  @Get('contact-requests')
  async getContactRequests() {
    return await this.miscService.fetchContactRequests();
  }

  @Post('contact-requests')
  async createContactRequest(@Body() data: Prisma.ContactRequestsCreateInput) {
    return await this.miscService.createContactRequest(data);
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

  @Post('doctor/upload-avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // Explicitly set 2MB limit for Multer
      },
    }),
  )
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await uploadBufferToCloudinary(file.buffer);
      console.log(result);

      return {
        message: 'Upload successful',
        url: result.secure_url,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new HttpException(
        'Cloudinary upload failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
