import { OmitType } from '@nestjs/mapped-types';
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page-request.dto';

export class PengembalianDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsDate()
  tanggal_pengembalian: Date;

  @IsOptional()
  @IsNumber()
  denda: number;

  @IsNotEmpty()
  @IsNumber()
  peminjaman_id: number;
}

export class CreatePengembalianDto extends OmitType(PengembalianDto, ['id']) {}

export class FindPengembalianDto extends PageRequestDto {
  @IsOptional()
  @IsNumber()
  id_anggota: number;
}
