import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AnggotaService } from './anggota.service';
import { RegisterDto } from './anggota.dto';
import { JwtGuard } from 'src/auth/auth.guard';

@Controller('anggota')
export class AnggotaController {
  constructor(private authService: AnggotaService) {}

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
}
