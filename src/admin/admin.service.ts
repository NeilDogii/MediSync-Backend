import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { database } from '../common/utils/database.util';
import { Prisma, Report } from '@prisma/client';
import { EncryptUtil } from '../common/utils/encrypt.util';

@Injectable()
export class AdminService {
  constructor(private readonly encryptUtil: EncryptUtil) {}
  private readonly db = database;

  async fetchAdmin(adminId: number) {
    if (!adminId) {
      throw new HttpException('Admin ID is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const admin = await this.db.admin.findUnique({
        where: { id: adminId },
        select: {
          id: true,
          username: true,
        },
      });

      if (!admin) {
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
      }

      return admin;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch admin details: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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

  async fetchReports() {
    try {
      const data = await this.db.report.findMany({
        include: {
          appointment: {
            select: {
              doctor: {
                select: {
                  id: true,
                  name: true,
                },
              },
              patient: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch reports: ' + error,
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

  async updateAdmin({
    id,
    data,
  }: {
    id: string;
    data: Prisma.AdminUpdateInput;
  }) {
    if (!data || Object.keys(data).length === 0 || !id || isNaN(Number(id))) {
      throw new HttpException('Admin data is required', HttpStatus.BAD_REQUEST);
    }
    try {
      if (data.password) {
        data.password = await this.encryptUtil.encryptPayload(
          data.password as string,
        );
      }
      const admin = await this.db.admin.update({
        where: { id: Number(id) },
        data,
      });
      return admin;
    } catch (error) {
      throw new HttpException(
        'Failed to update admin: ' + error,
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
  async fetchDoctorRequests() {
    return await this.db.doctor.findMany({
      where: {
        status: 'PENDING',
      },
      omit: {
        password: true,
      },
    });
  }
  async approveDoctor(id: string) {
    if (!id || isNaN(Number(id))) {
      throw new HttpException(
        'Valid doctor ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.db.doctor.update({
      where: {
        id: Number(id),
      },
      data: {
        status: 'APPROVED' as any,
      },
    });
  }
  async rejectDoctor(id: string) {
    if (!id || isNaN(Number(id))) {
      throw new HttpException(
        'Valid doctor ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.db.doctor.update({
      where: {
        id: Number(id),
      },
      data: {
        status: 'REJECTED' as any,
      },
    });
  }
  async fetchPatients() {
    try {
      const data = await this.db.patient.findMany({
        omit: {
          password: true,
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch patients: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
