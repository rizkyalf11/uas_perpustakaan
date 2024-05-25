import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Pengembalian } from './pengembalian.entity';
import { Repository } from 'typeorm';
import { CreatePengembalianDto, FindPengembalianDto } from './pengembalian.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import { Peminjaman } from 'src/peminjaman/peminjaman.entity';
import { Buku } from 'src/book/book.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PengembalianService extends BaseResponse {
  constructor(
    @InjectRepository(Pengembalian)
    private readonly pengembalianRepo: Repository<Pengembalian>,
    @InjectRepository(Peminjaman)
    private readonly peminjamanRepo: Repository<Peminjaman>,
    @InjectRepository(Buku)
    private readonly BukuRepo: Repository<Buku>,
  ) {
    super();
  }

  async createPengembalian(
    payload: CreatePengembalianDto,
  ): Promise<ResponseSuccess> {
    const peminjaman = await this.peminjamanRepo.findOne({
      where: { id: payload.peminjaman_id },
      relations: ['id_buku', 'id_anggota'],
    });

    if (peminjaman.is_return) {
      throw new HttpException(
        'Data peminjaman tidak ada',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (peminjaman && !peminjaman.is_return) {
      const buku = await this.BukuRepo.findOne({
        where: { id: peminjaman.id_buku.id },
      });

      peminjaman.is_return = true;
      buku.jumlah_kopi += 1;

      const returnDate = payload.tanggal_pengembalian.getTime();
      const dueDate = new Date(peminjaman.tanggal_kembali).getTime();
      const lateDays = Math.ceil(
        (returnDate - dueDate) / (1000 * 60 * 60 * 24),
      );

      let denda = 0;
      if (lateDays > 0) {
        const dendaPerDay = 5000;
        denda = lateDays * dendaPerDay;
      }

      await peminjaman.save();
      await buku.save();

      await this.pengembalianRepo.save(
        plainToClass(Pengembalian, { ...payload, denda }),
      );

      return this._success('Success');
    }
  }

  async getAllPengembalian(
    payload: FindPengembalianDto,
  ): Promise<ResponsePagination> {
    const { page, pageSize, id_anggota, limit } = payload;

    const filter: { [title: string]: any } = {};

    if (id_anggota) {
      filter.peminjaman_id = {
        id_anggota: {
          id: id_anggota,
        },
      };
    }

    const listpinjaman = await this.pengembalianRepo.find({
      where: {
        ...filter,
      },
      skip: limit,
      take: pageSize,
      relations: ['peminjaman_id', 'peminjaman_id.id_anggota'],
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
