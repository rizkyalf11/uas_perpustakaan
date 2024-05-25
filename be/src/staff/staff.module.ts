import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './staff.entity';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { JwtService } from '@nestjs/jwt';
import { Anggota } from 'src/anggota/anggota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Anggota])],
  controllers: [StaffController],
  providers: [StaffService, JwtService],
})
export class StaffModule {}
