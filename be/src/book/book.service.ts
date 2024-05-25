import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBukuDtoArray, FindBukuDto, UpdateBukuDto } from './buku.dto';
import BaseResponse from 'src/utils/response/base.response';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Buku } from './book.entity';
import { Between, Like, Repository } from 'typeorm';

@Injectable()
export class BookService extends BaseResponse {
  constructor(
    @InjectRepository(Buku) private readonly bukuRepo: Repository<Buku>,
  ) {
    super();
  }

  async createBuku(payload: CreateBukuDtoArray): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;

      await Promise.all(
        payload.data.map(async (data) => {
          try {
            await this.bukuRepo.save(data);

            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );

      return this._success(
        `Berhasil menyimpan ${berhasil} buku dan gagal ${gagal}`,
      );
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteBook(id: number): Promise<ResponseSuccess> {
    const check = await this.bukuRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    await this.bukuRepo.delete(id);
    return this._success('Berhasil menghapus buku');
  }

  async updateBook(
    id: number,
    updateBookDto: UpdateBukuDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bukuRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);

    const update = await this.bukuRepo.save({ ...updateBookDto, id: id });

    return this._success('Berhasil Mengupdate Buku', update);
  }

  async getAllBooks(query: FindBukuDto): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      limit,
      judul,
      pengarang,
      dari_tahun_terbit,
      sampai_tahun_terbit,
    } = query;

    const total = await this.bukuRepo.count();

    const filter: { [title: string]: any } = {};

    if (judul) {
      filter.judul = Like(`%${judul}%`);
    }
    if (pengarang) {
      filter.pengarang = Like(`%${pengarang}%`);
    }

    if (dari_tahun_terbit && sampai_tahun_terbit) {
      filter.year = Between(dari_tahun_terbit, sampai_tahun_terbit);
    }

    if (dari_tahun_terbit && !!sampai_tahun_terbit === false) {
      filter.year = Between(dari_tahun_terbit, dari_tahun_terbit);
    }

    const result = await this.bukuRepo.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }
}
