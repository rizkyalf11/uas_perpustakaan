import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { BookModule } from './book/book.module';
import { AnggotaModule } from './anggota/anggota.module';
import { PeminjamanModule } from './peminjaman/peminjaman.module';
import { StaffModule } from './staff/staff.module';
import { PengembalianModule } from './pengembalian/pengembalian.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigAsync } from './config/jwt.config';
import { UploadController } from './upload/upload.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { Staff } from './staff/staff.entity';
import { Anggota } from './anggota/anggota.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TypeOrmModule.forFeature([Staff, Anggota]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync(jwtConfigAsync),
    AuthModule,
    BookModule,
    AnggotaModule,
    PeminjamanModule,
    StaffModule,
    PengembalianModule,
  ],
  controllers: [UploadController, AuthController],
  providers: [AuthService],
})
export class AppModule {}
