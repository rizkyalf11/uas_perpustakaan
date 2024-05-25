import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anggota } from 'src/anggota/anggota.entity';
import { Staff } from 'src/staff/staff.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './jwtAccessTokenStrategy';
import { JwtRefreshTokenStrategy } from './jwtRefreshTokenStrategy';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Anggota])],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AuthModule {}
