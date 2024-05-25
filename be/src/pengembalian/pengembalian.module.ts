import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pengembalian } from './pengembalian.entity';
import { PengembalianController } from './pengembalian.controller';
import { PengembalianService } from './pengembalian.service';
import { Peminjaman } from 'src/peminjaman/peminjaman.entity';
import { Buku } from 'src/book/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pengembalian, Peminjaman, Buku])],
  controllers: [PengembalianController],
  providers: [PengembalianService],
})
export class PengembalianModule {}
