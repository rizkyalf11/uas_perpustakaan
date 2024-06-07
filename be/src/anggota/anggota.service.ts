import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import BaseResponse from 'src/utils/response/base.response';
import { Anggota } from './anggota.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FindAnggota, RegisterDto } from './anggota.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from '../auth/jwt.interface';
import { ConfigService } from '@nestjs/config';
import { Peminjaman } from 'src/peminjaman/peminjaman.entity';
import { Staff } from 'src/staff/staff.entity';

@Injectable()
export class AnggotaService extends BaseResponse {
  constructor(
    @InjectRepository(Anggota)
    private readonly anggotaRepo: Repository<Anggota>,
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    @InjectRepository(Peminjaman)
    private readonly peminjamanRepo: Repository<Peminjaman>,
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
    const checkUserExists = await this.anggotaRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    const checkUserExistsStaff = await this.staffRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExists || checkUserExistsStaff) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12); //hash password
    await this.anggotaRepo.save(payload);

    return this._success('Register Berhasil');
  }

  // async login(payload: LoginDto): Promise<ResponseSuccess> {
  //   const checkUserExists = await this.anggotaRepo.findOne({
  //     where: {
  //       email: payload.email,
  //     },
  //     select: {
  //       id: true,
  //       nama: true,
  //       email: true,
  //       alamat: true,
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
  //       role: null,
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

  //     await this.anggotaRepo.save({
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

  async getPinjamActive(id: number): Promise<ResponseSuccess> {
    console.log(id);
    const listBuku = await this.peminjamanRepo.find({
      where: {
        is_return: false,
        id_anggota: { id },
      },
      relations: ['id_anggota', 'id_buku'],
    });

    return this._success('OK', listBuku);
  }

  async getPinjamHistory(id: number): Promise<ResponseSuccess> {
    console.log(id);
    const listBuku = await this.peminjamanRepo.find({
      where: {
        is_return: true,
        id_anggota: { id },
      },
      relations: ['id_anggota', 'id_buku', 'pengembalian'],
    });

    return this._success('OK', listBuku);
  }

  async getAllAnggota(query: FindAnggota): Promise<ResponsePagination> {
    const { keyword, page, pageSize, limit } = query;

    const filterKeyword = [];

    if (keyword) {
      filterKeyword.push(
        {
          nama: Like(`%${keyword}%`),
        },
        {
          email: Like(`%${keyword}%`),
        },
      );
    }

    const total = await this.anggotaRepo.count({
      where: filterKeyword,
    });

    const list = await this.anggotaRepo.find({
      where: filterKeyword,
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', list, total, page, pageSize);
  }

  async getAnggotaDetail(id: number): Promise<ResponseSuccess> {
    const anggota = await this.anggotaRepo.findOne({
      where: {
        id: id,
      },
    });

    if (anggota === null) {
      throw new NotFoundException(`Anggota dengan id ${id} tidak ditemukan`);
    }

    return this._success('OK', anggota);
  }
}
