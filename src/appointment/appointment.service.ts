import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Appointment } from '@prisma/client';
import { database } from '../common/utils/database.util';
import { JwtUtil } from '../common/utils/jwt.util';

@Injectable()
export class AppointmentService extends JwtUtil {
  private readonly db = database;

  async fetchAppointments({ doctorId }: { doctorId?: string }) {
    try {
      const data = await this.db.appointment.findMany({
        where: {
          doctorId: doctorId ? Number(doctorId) : undefined,
        },
        include: {
          patient: {
            select: {
              name: true,
              email: true,
              age: true,
              gender: true,
              phone: true,
            },
          },
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch appointments: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAppointment(data: Appointment) {
    try {
      const response = await this.db.appointment.create({
        data,
      });
      return response;
    } catch (error) {
      throw new HttpException(
        'Error creating appointment' + JSON.stringify(error, null, 2),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAppointment({
    id,
    data,
  }: {
    id: string;
    data: Partial<Appointment>;
  }) {
    if (!data || Object.keys(data).length === 0 || !id || isNaN(Number(id))) {
      throw new HttpException(
        'Appointment data is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const response = await this.db.appointment.update({
        where: {
          id: Number(id),
        },
        data,
      });
      return response;
    } catch (error) {
      throw new HttpException(
        'Error updating appointment' + JSON.stringify(error, null, 2),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchPatients({ doctorId }: { doctorId?: string }) {
    if (!doctorId || isNaN(Number(doctorId))) {
      throw new HttpException('Doctor ID is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const data = await this.db.patient.findMany({
        where: {
          appointments: {
            some: {
              doctorId: Number(doctorId),
            },
          },
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

  async fetchPatientAppointments({ patientId }: { patientId?: string }) {
    if (!patientId || isNaN(Number(patientId))) {
      throw new HttpException('Patient ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const data = await this.db.appointment.findMany({
        where: {
          patientId: Number(patientId),
        },
        include: {
          doctor: {
            select: {
              name: true,
              email: true,
              specialization: true,
              phone: true,
              fees: true,
            },
          },
        },
      });

      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch patient appointments: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMeetingToken({
    appointmentId,
    type,
  }: {
    appointmentId: number;
    type: 'doctor' | 'patient';
  }) {
    if (!appointmentId || isNaN(Number(appointmentId))) {
      throw new HttpException(
        'Appointment ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const appointment = await this.db.appointment.findUnique({
        where: {
          id: appointmentId,
        },
        include: {
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
      });
      if (!appointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }
      const token = await this.generateToken(
        {
          type,
          appointmentId,
          doctor: {
            id: appointment.doctor.id,
            name: appointment.doctor.name,
          },
          patient: {
            id: appointment.patient.id,
            name: appointment.patient.name,
          },
        },
        '3h',
      );

      return { token };
    } catch (error) {
      throw new HttpException(
        'Error creating meeting token' + JSON.stringify(error, null, 2),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
