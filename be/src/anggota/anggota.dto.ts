import { PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class AnggotaDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  refresh_token: string;
}

export class RegisterDto extends PickType(AnggotaDto, [
  'nama',
  'email',
  'password',
  'alamat',
]) {}

export class LoginDto extends PickType(AnggotaDto, ['email', 'password']) {}
