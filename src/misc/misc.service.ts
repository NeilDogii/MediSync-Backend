import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { database } from '../common/utils/database.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class MiscService {
  db = database;

  async fetchDoctor(doctorId: number) {
    if (!doctorId) {
      throw new HttpException('Doctor ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const doctor = await this.db.doctor.findUnique({
        where: { id: doctorId },
        select: {
          id: true,
          name: true,
          email: true,
          specialization: true,
          phone: true,
          fees: true,
        },
      });

      if (!doctor) {
        throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
      }

      return doctor;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch doctor details: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchDoctorDashboard(doctorId: number) {
    if (!doctorId) {
      throw new HttpException('Doctor ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const doctorAppointments = await this.db.appointment.findMany({
        where: {
          doctorId: doctorId,
        },
        include: {
          report: {
            select: {
              appointmentId: true,
              date: true,
            },
          },
          patient: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const today = new Date().toDateString();

      const patientCount = doctorAppointments.length;

      const totalVisitCount = doctorAppointments.length;

      const pendingReportsCount = doctorAppointments.filter(
        (appointment) => !appointment.report,
      ).length;

      const appointmentsTodayCount = doctorAppointments.filter(
        (appointment) => {
          const appointmentDate = new Date(
            appointment.report?.date || '',
          ).toDateString();
          return appointmentDate === today;
        },
      ).length;

      const upcomingAppointments = doctorAppointments
        .filter((appointment) => {
          return appointment.status === 'SCHEDULED';
        })
        .map((appointment) => ({
          id: appointment.id,
          name: appointment.patient.name,
          date: appointment?.date || null,
        }));

      const recentPatients = doctorAppointments
        .slice(0, 5)
        .map((appointment) => ({
          id: appointment.patient.id,
          name: appointment.patient.name,
          date: appointment?.date || null,
        }));

      const pendingReports = doctorAppointments
        .filter((appointment) => !appointment.report)
        .map((appointment) => ({
          id: appointment.id,
          name: appointment.patient.name,
          date: appointment?.date || null,
        }));

      return {
        patientCount,
        totalVisitCount,
        pendingReportsCount,
        pendingReports,
        appointmentsTodayCount,
        upcomingAppointmentsCount: upcomingAppointments.length,
        upcomingAppointments,
        recentPatients,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch doctor dashboard: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDoctorSettings(
    doctorId: number,
    settings: Prisma.DoctorUpdateInput,
  ) {
    if (!doctorId) {
      throw new HttpException('Doctor ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const updatedDoctor = await this.db.doctor.update({
        where: { id: doctorId },
        data: settings,
      });

      return updatedDoctor;
    } catch (error) {
      throw new HttpException(
        'Failed to update doctor settings: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchContactRequests() {
    try {
      const contactRequests = await this.db.contactRequests.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return contactRequests;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch contact requests: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createContactRequest(data: Prisma.ContactRequestsCreateInput) {
    if (!data) {
      throw new HttpException(
        'Contact request data is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const contactRequest = await this.db.contactRequests.create({
        data,
      });

      return contactRequest;
    } catch (error) {
      throw new HttpException(
        'Failed to create contact request: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
