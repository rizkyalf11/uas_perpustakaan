import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buku } from './book.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Buku])],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
