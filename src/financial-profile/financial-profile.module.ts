import { Module } from '@nestjs/common';
import { FinancialProfileService } from './financial-profile.service';
import { FinancialProfileController } from './financial-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialProfile } from './entities/financial-profile.entity';
import { FinancialProfileRepository } from './financial-profile.repository';
import { TokenModule } from '../auth/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialProfile]), TokenModule],
  controllers: [FinancialProfileController],
  providers: [FinancialProfileService, FinancialProfileRepository],
  exports: [FinancialProfileService, FinancialProfileRepository],
})
export class FinancialProfileModule {}
