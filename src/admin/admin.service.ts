import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { database } from '../common/utils/database.util';
import { Prisma } from '@prisma/client';
import { EncryptUtil } from '../common/utils/encrypt.util';

@Injectable()
export class AdminService {
  constructor(private readonly encryptUtil: EncryptUtil) {}
  private readonly db = database;

  async fetchDoctors() {
    try {
      const data = await this.db.doctor.findMany({
        omit: {
          password: true,
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch doctors: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createDoctor({ data }: { data: Prisma.DoctorCreateInput }) {
    if (!data) {
      throw new HttpException(
        'Doctor data is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const doctor = await this.db.doctor.create({
        data,
      });

      return doctor;
    } catch (error) {
      throw new HttpException(
        'Failed to create doctor: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDoctor({
    id,
    data,
  }: {
    id: string;
    data: Prisma.DoctorUpdateInput;
  }) {
    if (!data || Object.keys(data).length === 0 || !id || isNaN(Number(id))) {
      throw new HttpException(
        'Doctor data is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      if (data.password) {
        data.password = await this.encryptUtil.encryptPayload(
          data.password as string,
        );
      }
      const doctor = await this.db.doctor.update({
        where: { id: Number(id) },
        data,
      });
      return doctor;
    } catch (error) {
      throw new HttpException(
        'Failed to update doctor: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDoctor(id: string) {
    if (!id || isNaN(Number(id))) {
      throw new HttpException(
        'Valid doctor ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.db.doctor.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to delete doctor: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
