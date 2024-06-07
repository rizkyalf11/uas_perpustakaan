import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBukuDtoArray, FindBukuDto, UpdateBukuDto } from './buku.dto';
import { JwtGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { InjectBulkCreatedBy } from 'src/utils/decorator/inject-bulk.created-by.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { StaffRole } from 'src/staff/staff.entity';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-bulk.updated-by.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('book')
export class BookController {
  constructor(private bukuService: BookService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.PUSTAKAWAN)
  @Post('createbulk')
  bulkCreate(@InjectBulkCreatedBy() payload: CreateBukuDtoArray) {
    return this.bukuService.createBuku(payload);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.PUSTAKAWAN)
  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.bukuService.deleteBook(+id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.PUSTAKAWAN)
  @Get('detail/:id')
  detailBook(@Param('id') id: string) {
    return this.bukuService.detialBook(+id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(StaffRole.PUSTAKAWAN)
  @Put('update/:id')
  updateBook(
    @Param('id') id: string,
    @InjectUpdatedBy() payload: UpdateBukuDto,
  ) {
    return this.bukuService.updateBook(Number(id), payload);
  }

  @UseGuards(JwtGuard)
  @Get('/list')
  findAllBook(@Pagination() findBookDto: FindBukuDto) {
    return this.bukuService.getAllBooks(findBookDto);
  }
}
