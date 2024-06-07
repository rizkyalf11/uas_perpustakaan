import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthDto, ResetPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';
import { ResponseSuccess } from 'src/interface/response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() payload: AuthDto) {
    console.log(payload);
    return this.authService.login(payload);
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Req() req): Promise<ResponseSuccess> {
    return this.authService.getProfile(req.user);
  }

  @Post('lupa-pw')
  async forgotPassowrd(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-pw/:user_id/:token')
  async resetPassword(
    @Param('user_id') user_id: string,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(+user_id, token, payload);
  }
}
