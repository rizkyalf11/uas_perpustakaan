import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtPayload } from 'src/auth/jwt.interface';
import { ResponseSuccess } from 'src/interface/response';
import { compare } from 'bcrypt';
import { Anggota } from 'src/anggota/anggota.entity';
import BaseResponse from 'src/utils/response/base.response';
import { Staff } from 'src/staff/staff.entity';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    @InjectRepository(Anggota)
    private readonly anggotaRepo: Repository<Anggota>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  generateJWT(
    payload: jwtPayload,
    expiresIn: string | number,
    token: string | Buffer,
  ) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  }

  async login(payload: AuthDto): Promise<ResponseSuccess> {
    const checkUserExistsAnggota = await this.anggotaRepo.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        alamat: true,
        password: true,
        refresh_token: true,
      },
    });
    const checkUserExistsStaff = await this.staffRepo.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExistsAnggota && !checkUserExistsStaff) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (checkUserExistsAnggota) {
      const checkPassword = await compare(
        payload.password,
        checkUserExistsAnggota.password,
      );

      if (checkPassword) {
        const jwtPayload: jwtPayload = {
          id: checkUserExistsAnggota.id,
          nama: checkUserExistsAnggota.nama,
          email: checkUserExistsAnggota.email,
          role: null,
        };

        const access_token = this.generateJWT(
          jwtPayload,
          '1m',
          this.configService.get('JWT_SECRET'),
        );

        const refresh_token = this.generateJWT(
          jwtPayload,
          '7d',
          this.configService.get('JWT_SECRET'),
        );

        await this.anggotaRepo.save({
          refresh_token: refresh_token,
          id: checkUserExistsAnggota.id,
        });

        return this._success('Login Success', {
          ...checkUserExistsAnggota,
          role: 'anggota',
          refresh_token,
          access_token,
        });
      } else {
        throw new HttpException(
          'email dan password tidak sama',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    } else {
      const checkPassword = await compare(
        payload.password,
        checkUserExistsStaff.password,
      );

      if (checkPassword) {
        const jwtPayload: jwtPayload = {
          id: checkUserExistsStaff.id,
          nama: checkUserExistsStaff.nama,
          email: checkUserExistsStaff.email,
          role: checkUserExistsStaff.role,
        };

        const access_token = this.generateJWT(
          jwtPayload,
          '1m',
          this.configService.get('JWT_SECRET'),
        );

        const refresh_token = this.generateJWT(
          jwtPayload,
          '7d',
          this.configService.get('JWT_SECRET'),
        );

        await this.staffRepo.save({
          refresh_token: refresh_token,
          id: checkUserExistsStaff.id,
        });

        return this._success('Login Success', {
          ...checkUserExistsStaff,
          refresh_token,
          access_token,
        });
      } else {
        throw new HttpException(
          'email dan password tidak sama',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
  }

  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkUserExistsAnggota = await this.anggotaRepo.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        alamat: true,
        password: true,
        refresh_token: true,
      },
    });
    const checkUserExistsStaff = await this.staffRepo.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExistsAnggota && !checkUserExistsStaff) {
      throw new UnauthorizedException();
    }

    if (checkUserExistsAnggota) {
      const jwtPayload: jwtPayload = {
        id: checkUserExistsAnggota.id,
        nama: checkUserExistsAnggota.nama,
        email: checkUserExistsAnggota.email,
        role: null,
      };

      const access_token = this.generateJWT(
        jwtPayload,
        '1d',
        this.configService.get('JWT_SECRET'),
      );

      const refresh_token = this.generateJWT(
        jwtPayload,
        '7d',
        this.configService.get('JWT_SECRET'),
      );

      await this.anggotaRepo.save({
        refresh_token: refresh_token,
        id: checkUserExistsAnggota.id,
      });

      return this._success('Success', {
        ...checkUserExistsAnggota,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      const jwtPayload: jwtPayload = {
        id: checkUserExistsStaff.id,
        nama: checkUserExistsStaff.nama,
        email: checkUserExistsStaff.email,
        role: checkUserExistsStaff.role,
      };

      const access_token = this.generateJWT(
        jwtPayload,
        '1d',
        this.configService.get('JWT_SECRET'),
      );

      const refresh_token = this.generateJWT(
        jwtPayload,
        '7d',
        this.configService.get('JWT_SECRET'),
      );

      await this.staffRepo.save({
        refresh_token: refresh_token,
        id: checkUserExistsStaff.id,
      });

      return this._success('Success', {
        ...checkUserExistsStaff,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    }
  }
}
