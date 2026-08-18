import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { UsersRepository } from './users.repository';
import { TokenModule } from '../auth/jwt.module';
import { FinancialProfileService } from '../financial-profile/financial-profile.service';
import { FinancialProfileRepository } from '../financial-profile/financial-profile.repository';
import { FinancialProfile } from '../financial-profile/entities/financial-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TokenModule,
    TypeOrmModule.forFeature([FinancialProfile]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    FinancialProfileService,
    FinancialProfileRepository,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
