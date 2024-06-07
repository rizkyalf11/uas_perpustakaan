import { OmitType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page-request.dto';

export class PeminjamanDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsDate()
  tanggal_pinjam: Date;

  @IsNotEmpty()
  @IsDate()
  tanggal_kembali: Date;

  @IsNotEmpty()
  @IsNumber()
  id_anggota: number;

  @IsNotEmpty()
  @IsNumber()
  id_buku: number;
}

export class CreatePeminjamanDto extends OmitType(PeminjamanDto, ['id']) {}

export class FindPinjamanDto extends PageRequestDto {
  @IsOptional()
  @IsNumber()
  id_anggota: number;

  @IsOptional()
  @IsString()
  email: string;
}
