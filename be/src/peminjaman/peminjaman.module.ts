import { Module } from '@nestjs/common';
import { PeminjamanController } from './peminjaman.controller';
import { PeminjamanService } from './peminjaman.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Peminjaman } from './peminjaman.entity';
import { Buku } from 'src/book/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Peminjaman, Buku])],
  controllers: [PeminjamanController],
  providers: [PeminjamanService],
})
export class PeminjamanModule {}
