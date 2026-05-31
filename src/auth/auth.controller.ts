import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/validate-user/:id')
  async validateUser(@Param('id') id: string) {
    return await this.authService.validateUser(id);
  }

  @Post('/update-user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: Prisma.PatientUpdateInput,
  ) {
    return await this.authService.updateUser(id, body);
  }

  @Post('/validate-token')
  async validateToken(@Body('token') token: string) {
    return await this.authService.validateToken(token);
  }

  @Post('/patient/login')
  @HttpCode(HttpStatus.OK)
  async patientLogin(@Body() body: { email: string; password: string }) {
    return await this.authService.loginUser(body);
  }

  @Post('/patient/register')
  @HttpCode(HttpStatus.CREATED)
  async patientRegister(
    @Body()
    body: Prisma.PatientCreateInput,
  ) {
    return await this.authService.registerUser(body);
  }

  @Post('/doctor/create')
  @HttpCode(HttpStatus.CREATED)
  async doctorCreate(
    @Body()
    body: Prisma.DoctorCreateInput,
  ) {
    return await this.authService.createDoctor(body);
  }

  @Post('/doctor/login')
  @HttpCode(HttpStatus.OK)
  async doctorLogin(@Body() body: { username: string; password: string }) {
    return await this.authService.loginDoctor(body);
  }

  @Post('/admin/create')
  @HttpCode(HttpStatus.CREATED)
  async adminCreate(
    @Body()
    body: Prisma.AdminCreateInput,
  ) {
    return await this.authService.createAdmin(body);
  }

  @Post('/admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() body: { username: string; password: string }) {
    return await this.authService.loginAdmin(body);
  }
}
