import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtUtil } from '../common/utils/jwt.util';
import { database } from '../common/utils/database.util';
import { EncryptUtil } from '../common/utils/encrypt.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtUtil: JwtUtil,
    private readonly encryptUtil: EncryptUtil,
  ) {}
  private readonly db = database;

  // Patient Login
  async loginUser(body: {
    email: string;
    password: string;
  }): Promise<{ token: string } | HttpException> {
    if (!body || !body.email || !body.password) {
      throw new HttpException(
        'Email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.db.patient.findFirst({
      where: { email: body.email },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (await this.encryptUtil.verifyPayload(body.password, user.password)) {
      const token = await this.jwtUtil.generateToken({
        userId: user.id,
        role: 'patient',
      });
      return { token };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async registerUser(
    body: Prisma.PatientCreateInput,
  ): Promise<{ token: string } | HttpException> {
    if (!body.email || !body.password || !body.name || !body.phone) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingUser = await this.db.patient.findFirst({
      where: {
        OR: [
          {
            email: body.email,
          },
          {
            phone: body.phone,
          },
        ],
      },
    });
    if (existingUser) {
      throw new HttpException(
        'Credentials already in use',
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await this.encryptUtil.encryptPayload(body.password);
    const newUser = await this.db.patient.create({
      data: { ...body, password: hashedPassword },
    });
    const token = await this.jwtUtil.generateToken({
      userId: newUser.id,
      role: 'patient',
    });
    return { token };
  }

  async createDoctor(
    body: Prisma.DoctorCreateInput,
  ): Promise<Prisma.DoctorCreateInput | HttpException> {
    if (
      !body.username ||
      !body.password ||
      !body.name ||
      !body.specialization
    ) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingUser = await this.db.doctor.findFirst({
      where: {
        username: body.username,
      },
    });
    if (existingUser) {
      throw new HttpException('Username already in use', HttpStatus.CONFLICT);
    }
    const hashedPassword = await this.encryptUtil.encryptPayload(body.password);
    const newDoctor = await this.db.doctor.create({
      data: { ...body, password: hashedPassword },
    });
    return newDoctor;
  }

  async loginDoctor(body: { username: string; password: string }) {
    if (!body || !body.username || !body.password) {
      throw new HttpException(
        'Username and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.db.doctor.findFirst({
      where: { username: body.username },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (await this.encryptUtil.verifyPayload(body.password, user.password)) {
      const token = await this.jwtUtil.generateToken({
        userId: user.id,
        role: 'doctor',
      });
      return { token };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async createAdmin(
    body: Prisma.AdminCreateInput,
  ): Promise<Prisma.AdminCreateInput | HttpException> {
    if (!body.username || !body.password) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingUser = await this.db.admin.findFirst({
      where: {
        username: body.username,
      },
    });
    if (existingUser) {
      throw new HttpException('Username already in use', HttpStatus.CONFLICT);
    }
    const hashedPassword = await this.encryptUtil.encryptPayload(body.password);
    const newAdmin = await this.db.admin.create({
      data: { ...body, password: hashedPassword },
    });
    return newAdmin;
  }

  async loginAdmin(body: { username: string; password: string }) {
    if (!body || !body.username || !body.password) {
      throw new HttpException(
        'Username and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.db.admin.findFirst({
      where: { username: body.username },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (await this.encryptUtil.verifyPayload(body.password, user.password)) {
      const token = await this.jwtUtil.generateToken({
        userId: user.id,
        role: 'admin',
      });
      return { token };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateToken(token: string) {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.jwtUtil.verifyToken(token);
      if (!result) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      return result;
    } catch {
      throw new HttpException(
        'Token verification failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async validateUser(id: string) {
    if (!id) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const data = await this.db.patient.findUnique({
        where: {
          id: Number(id),
        },
        omit: {
          password: true,
          isActive: true,
        },
      });

      if (!data) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to validate user: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: string, body: Prisma.PatientUpdateInput) {
    if (!id) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const data = await this.db.patient.update({
        where: {
          id: Number(id),
        },
        data: body,
        omit: {
          password: true,
          isActive: true,
        },
      });

      if (!data) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'User updated successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to update user: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
