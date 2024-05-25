import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Peminjaman } from './peminjaman.entity';
import { Repository } from 'typeorm';
import { CreatePeminjamanDto, FindPinjamanDto } from './peminjaman.dto';
import { plainToClass } from 'class-transformer';
import { Buku } from 'src/book/book.entity';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';

@Injectable()
export class PeminjamanService extends BaseResponse {
  constructor(
    @InjectRepository(Peminjaman)
    private readonly peminjamanRepo: Repository<Peminjaman>,
    @InjectRepository(Buku) private readonly bukuRepo: Repository<Buku>,
  ) {
    super();
  }

  async createPeminjaman(
    payload: CreatePeminjamanDto,
  ): Promise<ResponseSuccess> {
    try {
      const buku = await this.bukuRepo.findOne({
        where: { id: payload.id_buku },
      });

      if (buku.jumlah_kopi > 0) {
        buku.jumlah_kopi = buku.jumlah_kopi -= 1;
        buku.save();

        const data = await this.peminjamanRepo.save(
          plainToClass(Peminjaman, payload),
        );

        return this._success('Peminjaman berhasil', data);
      } else {
        throw new HttpException('Stok Buku Habis', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllPinjaman(payload: FindPinjamanDto): Promise<ResponsePagination> {
    const { page, pageSize, id_anggota, limit } = payload;

    const filter: { [title: string]: any } = {};

    if (id_anggota) {
      filter.id_anggota = {
        id: id_anggota,
      };
    }

    const listpinjaman = await this.peminjamanRepo.find({
      where: {
        ...filter,
        is_return: false,
      },
      skip: limit,
      take: pageSize,
      relations: ['id_anggota'],
    });

    return this._pagination(
      'Success',
      listpinjaman,
      listpinjaman.length,
      page,
      pageSize,
    );
  }
}
