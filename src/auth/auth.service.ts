import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import {
  ResponseLogin,
  ResponseLogout,
  ResponseProfile,
  ResponseRegister,
  ResponseSessions,
} from './types/response.auth.type';
import { hashSync, verifySync } from '@node-rs/bcrypt';
import { ResponseEntity } from 'src/config/entities/response.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayloadEntity } from './models/jwt.payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<ResponseRegister> {
    try {
      const findUser = await this.prismaService.user.findFirst({
        where: {
          email: registerDto.email,
        },
      });
      if (findUser.email === registerDto.email) {
        return new ResponseEntity(
          HttpStatus.BAD_REQUEST,
          'Email already exist',
        );
      }
      const user = await this.prismaService.user.create({
        data: {
          fullName: registerDto.fullName,
          email: registerDto.email,
          password: hashSync(registerDto.password),
        },
      });

      delete user.password;

      return new ResponseEntity(HttpStatus.CREATED, 'Register Success', user);
    } catch (error) {
      throw new ResponseEntity(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async login(loginDto: LoginDto, userAgent: string): Promise<ResponseLogin> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          email: loginDto.email,
        },
      });

      if (!user) {
        throw new Error('User does not exist');
      }

      if (!verifySync(loginDto.password, user.password)) {
        throw new Error('Email or password is incorrect');
      }

      let payload = new JwtPayloadEntity();
      payload = {
        id: uuidv4(),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      };
      const token = await this.jwtService.signAsync(payload);

      await this.prismaService.userSession.create({
        data: {
          id: payload.id,
          userAgent: userAgent,
          email: user.email,
          token: hashSync(token),
          userId: user.id,
        },
      });

      delete user.password;

      return new ResponseEntity(HttpStatus.CREATED, 'Login Success', {
        user: user,
        token: token,
      });
    } catch (error) {
      throw new ResponseEntity(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async profile(userInfo: JwtPayloadEntity): Promise<ResponseProfile> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userInfo.user.id,
        },
      });

      if (!user) {
        throw new Error('User does not exist');
      }

      delete user.password;

      return new ResponseEntity(HttpStatus.OK, 'Get Profile Success', user);
    } catch (error) {
      throw new ResponseEntity(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async logout(userInfo: JwtPayloadEntity): Promise<ResponseLogout> {
    try {
      await this.prismaService.userSession.delete({
        where: {
          id: userInfo.id,
        },
      });

      return new ResponseEntity(HttpStatus.OK, 'Logout Success', null);
    } catch (error) {
      throw new ResponseEntity(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async sessions(userInfo: JwtPayloadEntity): Promise<ResponseSessions> {
    try {
      const sessions = await this.prismaService.userSession.findMany({
        where: {
          userId: userInfo.user.id,
        },
        select: {
          id: true,
          userAgent: true,
          email: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              status: true,
            },
          },
        },
      });

      return new ResponseEntity(
        HttpStatus.OK,
        'Get Sessions Success',
        sessions,
      );
    } catch (error) {
      throw new ResponseEntity(HttpStatus.BAD_REQUEST, error.message);
    }
  }
}
