import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { database } from '../common/utils/database.util';

@Injectable()
export class AdminService {
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
}
