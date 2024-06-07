import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { CreatePeminjamanDto, FindPinjamanDto } from './peminjaman.dto';
import { JwtGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { StaffRole } from 'src/staff/staff.entity';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('peminjaman')
export class PeminjamanController {
  constructor(private peminjamanService: PeminjamanService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Post('/create')
  createPeminjaman(@Body() payload: CreatePeminjamanDto) {
    return this.peminjamanService.createPeminjaman(payload);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Get('/list')
  pinjaman(@Pagination() payload: FindPinjamanDto) {
    return this.peminjamanService.getAllPinjaman(payload);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Get('/detail/:id')
  pinjamanDetail(
    @Param('id') id: string,
    @Pagination() payload: FindPinjamanDto,
  ) {
    return this.peminjamanService.getAllPinjamanDetail(Number(+id), payload);
  }
}
