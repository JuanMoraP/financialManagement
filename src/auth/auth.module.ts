import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { UsersModule } from '../users/users.module';
import { TokenModule } from './jwt.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([RefreshToken]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
