import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PengembalianService } from './pengembalian.service';
import { CreatePengembalianDto, FindPengembalianDto } from './pengembalian.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtGuard } from 'src/auth/auth.guard';
import { StaffRole } from 'src/staff/staff.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('pengembalian')
export class PengembalianController {
  constructor(private pengembalianService: PengembalianService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Post('/create')
  createPeminjaman(@Body() payload: CreatePengembalianDto) {
    return this.pengembalianService.createPengembalian(payload);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Get('/list')
  pinjaman(@Pagination() payload: FindPengembalianDto) {
    return this.pengembalianService.getAllPengembalian(payload);
  }
}
