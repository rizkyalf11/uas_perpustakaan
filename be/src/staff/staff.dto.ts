import { PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { StaffRole } from './staff.entity';

export class StaffDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(StaffRole)
  role: StaffRole;

  @IsNotEmpty()
  @IsNumber()
  gaji: number;

  @IsString()
  refresh_token: string;
}

export class RegisterDto extends PickType(StaffDto, [
  'email',
  'password',
  'nama',
  'role',
  'gaji',
]) {}

export class LoginDto extends PickType(StaffDto, ['email', 'password']) {}
