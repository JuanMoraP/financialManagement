import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { FinancialProfile } from '../financial-profile/entities/financial-profile.entity';
import { FinancialProfileModule } from '../financial-profile/financial-profile.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TypeOrmModule.forFeature([FinancialProfile]),
    FinancialProfileModule,
    JwtModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
