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

@Module({
  imports: [TypeOrmModule.forFeature([Anggota, Peminjaman, Staff])],
  controllers: [AnggotaController],
  providers: [
    AnggotaService,
    JwtService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AnggotaModule {}
