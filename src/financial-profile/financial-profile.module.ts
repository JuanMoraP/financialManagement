import { Module } from '@nestjs/common';
import { FinancialProfileService } from './financial-profile.service';
import { FinancialProfileController } from './financial-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialProfile } from './entities/financial-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialProfile])],
  controllers: [FinancialProfileController],
  providers: [FinancialProfileService],
})
export class FinancialProfileModule {}
