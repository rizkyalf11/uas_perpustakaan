import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './staff.dto';
import { StaffService } from './staff.service';
import { JwtGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { StaffRole } from './staff.entity';

@Controller('staff')
export class StaffController {
  constructor(private authService: StaffService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  // @Post('login')
  // async login(@Body() payload: LoginDto) {
  //   return this.authService.login(payload);
  // }
}
