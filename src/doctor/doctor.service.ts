import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { database } from '../common/utils/database.util';

@Injectable()
export class DoctorService {
  private readonly db = database;

  async fetchDoctors() {
    try {
      const doctors = await this.db.doctor.findMany({
        where: {
          status: 'APPROVED',
        },
      });
      return doctors;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch doctors: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchDoctorAppointments(doctorId: number) {
    if (!doctorId) {
      throw new HttpException('Doctor ID is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const doctorAppointments = await this.db.appointment.findMany({
        where: {
          doctorId: doctorId,
        },
        include: {},
      });
      return doctorAppointments;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch doctor appointments: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
