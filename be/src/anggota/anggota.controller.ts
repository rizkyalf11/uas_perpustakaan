import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnggotaService } from './anggota.service';
import { FindAnggota, RegisterDto } from './anggota.dto';
import { JwtGuard } from 'src/auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { StaffRole } from 'src/staff/staff.entity';
import { PeminjamanService } from 'src/peminjaman/peminjaman.service';
import { FindPinjamanDto } from 'src/peminjaman/peminjaman.dto';

@Controller('anggota')
export class AnggotaController {
  constructor(
    private authService: AnggotaService,
    private pinjamanService: PeminjamanService,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  // @Post('login')
  // async login(@Body() payload: LoginDto) {
  //   return this.authService.login(payload);
  // }

  @UseGuards(JwtGuard)
  @Get('activepinjam')
  async activepinjam(@Req() req) {
    const { id } = req.user;
    console.log(req);
    return this.authService.getPinjamActive(id);
  }

  @UseGuards(JwtGuard)
  @Get('historypinjam')
  async historypinjam(@Req() req) {
    const { id } = req.user;
    console.log(req);
    return this.authService.getPinjamHistory(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Get('list')
  async findAll(@Pagination() query: FindAnggota) {
    return this.authService.getAllAnggota(query);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Get('detail/:id')
  async detailAnggota(@Param('id') id: string) {
    return this.authService.getAnggotaDetail(Number(id));
  }

  @Get('pinjaman')
  async getPinjaman(@Req() req: any, @Pagination() payload: FindPinjamanDto) {
    const id = req.user.id;

    return this.pinjamanService.getAllPinjamanDetail(id, payload);
  }
}
