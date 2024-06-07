import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anggota } from './anggota.entity';
import { AnggotaService } from './anggota.service';
import { AnggotaController } from './anggota.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from 'src/auth/jwtAccessTokenStrategy';
import { JwtRefreshTokenStrategy } from 'src/auth/jwtRefreshTokenStrategy';
import { Peminjaman } from 'src/peminjaman/peminjaman.entity';
import { Staff } from 'src/staff/staff.entity';
import { PeminjamanService } from 'src/peminjaman/peminjaman.service';
import { Buku } from 'src/book/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anggota, Peminjaman, Staff, Buku])],
  controllers: [AnggotaController],
  providers: [
    AnggotaService,
    JwtService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    PeminjamanService,
  ],
})
export class AnggotaModule {}
