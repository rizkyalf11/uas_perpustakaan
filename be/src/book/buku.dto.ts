import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page-request.dto';

export class BukuDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  judul: string;

  @IsNotEmpty()
  @IsString()
  pengarang: string;

  @IsNotEmpty()
  @IsNumber()
  tahun_terbit: number;

  @IsNotEmpty()
  @IsNumber()
  jumlah_kopi: number;

  @IsNotEmpty()
  @IsString()
  cover: string;

  @IsObject()
  @IsOptional()
  created_by: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };
}

export class CreateBukuDto extends OmitType(BukuDto, ['id', 'updated_by']) {}

export class CreateBukuDtoArray {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBukuDto)
  data: CreateBukuDto[];
}

export class UpdateBukuDto extends PartialType(BukuDto) {}

export class FindBukuDto extends PageRequestDto {
  @IsOptional()
  @IsString()
  judul: string;

  @IsOptional()
  @IsString()
  pengarang: string;

  @IsOptional()
  @IsNumber()
  dari_tahun_terbit: number;

  @IsOptional()
  @IsNumber()
  sampai_tahun_terbit: number;

  @IsOptional()
  @IsNumber()
  jumlah_kopi: number;
}
