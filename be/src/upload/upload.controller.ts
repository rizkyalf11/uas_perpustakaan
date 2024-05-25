import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResponseSuccess } from 'src/interface/response';
import BaseResponse from 'src/utils/response/base.response';
import { JwtGuard } from '../auth/auth.guard';
import { ConfigService } from '@nestjs/config';
import { Roles } from 'src/auth/roles.decorator';
import { StaffRole } from 'src/staff/staff.entity';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtGuard, RolesGuard)
@Controller('upload')
export class UploadController extends BaseResponse {
  constructor(private configService: ConfigService) {
    super();
  }

  @Roles(StaffRole.PUSTAKAWAN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}.${fileExtension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        if (fileExtension !== 'webp') {
          return cb(
            new HttpException(
              'Only .webp files are allowed',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Post('file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSuccess> {
    try {
      const url = `${this.configService.get('BASE_URL')}/uploads/${file.filename}`;
      return this._success('OK', {
        file_url: url,
        file_name: file.filename,
        file_size: file.size,
      });
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
