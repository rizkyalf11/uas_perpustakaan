import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import BaseResponse from 'src/utils/response/base.response';
import { Staff } from './staff.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtPayload } from 'src/auth/jwt.interface';
import { RegisterDto } from './staff.dto';
import { ResponseSuccess } from 'src/interface/response';
import { hash } from 'bcrypt';
import { Anggota } from 'src/anggota/anggota.entity';

@Injectable()
export class StaffService extends BaseResponse {
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

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.staffRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    const checkUserExistsAnggota = await this.anggotaRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExists || checkUserExistsAnggota) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12); //hash password
    await this.staffRepo.save(payload);

    return this._success('Register Berhasil');
  }

  // async login(payload: LoginDto): Promise<ResponseSuccess> {
  //   const checkUserExists = await this.staffRepo.findOne({
  //     where: {
  //       email: payload.email,
  //     },
  //     select: {
  //       id: true,
  //       nama: true,
  //       gaji: true,
  //       role: true,
  //       email: true,
  //       password: true,
  //       refresh_token: true,
  //     },
  //   });

  //   if (!checkUserExists) {
  //     throw new HttpException(
  //       'User tidak ditemukan',
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }

  //   const checkPassword = await compare(
  //     payload.password,
  //     checkUserExists.password,
  //   );

  //   if (checkPassword) {
  //     const jwtPayload: jwtPayload = {
  //       id: checkUserExists.id,
  //       nama: checkUserExists.nama,
  //       email: checkUserExists.email,
  //       role: checkUserExists.role,
  //     };

  //     const access_token = this.generateJWT(
  //       jwtPayload,
  //       '1d',
  //       this.configService.get('JWT_SECRET'),
  //     );

  //     const refresh_token = this.generateJWT(
  //       jwtPayload,
  //       '7d',
  //       this.configService.get('JWT_SECRET'),
  //     );

  //     await this.staffRepo.save({
  //       refresh_token: refresh_token,
  //       id: checkUserExists.id,
  //     });

  //     return this._success('Login Success', {
  //       ...checkUserExists,
  //       refresh_token,
  //       access_token,
  //     });
  //   } else {
  //     throw new HttpException(
  //       'email dan password tidak sama',
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }
  // }
}
