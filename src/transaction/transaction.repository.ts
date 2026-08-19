import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FinancialProfile } from '../financial-profile/entities/financial-profile.entity';
import { Category } from '../categories/entities/categories.entity';
import { TransactionEnum } from '../common/enum/transaction.enum';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(FinancialProfile)
    private readonly financialProfile: Repository<FinancialProfile>,
    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(
    userId: string,
    transactionInfo: CreateTransactionDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // const financialProfileRepository =
      //   queryRunner.manager.getRepository(FinancialProfile);
      // const transactionRepository =
      //   queryRunner.manager.getRepository(Transaction);

      const financialPro = await this.financialProfile.findOne({
        where: { userId: { id: userId } },
      });
      if (!financialPro)
        throw new NotFoundException('El perfil del usuario no fue encontrado');

      const newTransaction = this.transactionRepository.create({
        description: transactionInfo.description,
        transactionType: transactionInfo.transactionType,
        amount: transactionInfo.amount,
        financialProfileId: { id: financialPro.id } as FinancialProfile,
        categoryId: { id: transactionInfo.categoryId } as Category,
      });
      await this.transactionRepository.save(newTransaction);

      if (transactionInfo.transactionType === TransactionEnum.Outgoing)
        financialPro.currentAmount =
          Number(financialPro.currentAmount) - Number(transactionInfo.amount);
      if (transactionInfo.transactionType === TransactionEnum.Incoming)
        financialPro.currentAmount =
          Number(financialPro.currentAmount) + Number(transactionInfo.amount);

      financialPro.currentSpent =
        Number(financialPro.currentSpent) + Number(transactionInfo.amount);

      await this.financialProfile.save(financialPro);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return 'Transacción guardada con éxito';
  }
}
