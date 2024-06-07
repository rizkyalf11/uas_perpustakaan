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
import { compare, hash } from 'bcrypt';
import { Anggota } from 'src/anggota/anggota.entity';
import BaseResponse from 'src/utils/response/base.response';
import { Staff } from 'src/staff/staff.entity';
import { AuthDto, ResetPasswordDto } from './auth.dto';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { ResetPassword } from './resetpw.entity';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    @InjectRepository(Anggota)
    private readonly anggotaRepo: Repository<Anggota>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
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

    console.log(checkUserExistsAnggota);
    console.log(checkUserExistsStaff);

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

        return this._success('Login Success', {
          ...checkUserExistsAnggota,
          role: 'anggota',
          refresh_token,
          access_token,
        });
      } else {
        throw new HttpException(
          'Email dan Password tidak sama',
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

        return this._success('Login Success', {
          ...checkUserExistsStaff,
          refresh_token,
          access_token,
        });
      } else {
        throw new HttpException(
          'Email dan Password tidak sama',
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

  async getProfile(user: jwtPayload): Promise<ResponseSuccess> {
    let userProfile;

    if (user.role === 'anggota' || user.role === null) {
      userProfile = await this.anggotaRepo.findOne({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          nama: true,
          email: true,
          alamat: true,
        },
      });
    } else {
      userProfile = await this.staffRepo.findOne({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          nama: true,
          email: true,
          role: true,
        },
      });
    }

    if (!userProfile) {
      throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return this._success('success', userProfile);
  }

  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this.anggotaRepo.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = randomBytes(32).toString('hex');
    const link = `http://localhost:3000/resetpw/${user.id}/${token}`; //membuat link untuk reset password
    await this.mailService.sendForgotPassword({
      email: email,
      name: user.nama,
      link: link,
    });

    const payload = {
      anggota_id: {
        id: user.id,
      },
      token: token,
    };

    await this.resetPasswordRepository.save(payload); // menyimpan token dan id ke tabel reset password

    return this._success('Silahkan Cek Email');
  }

  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({
      where: {
        token: token,
        anggota_id: {
          id: user_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    payload.new_password = await hash(payload.new_password, 12);
    await this.anggotaRepo.save({
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepository.delete({
      anggota_id: {
        id: user_id,
      },
    });

    return this._success('Reset Passwod Berhasil, Silahkan login ulang');
  }
}
