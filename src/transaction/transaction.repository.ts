import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FinancialProfile } from '../financial-profile/entities/financial-profile.entity';
import { Category } from '../categories/entities/categories.entity';
import { TransactionEnum } from '../common/enum/transaction.enum';
import { GetTransactionQueryDto } from './dto/get-transaction-with-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(FinancialProfile)
    private readonly financialProfileRepository: Repository<FinancialProfile>,
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
      const financialProfileRepository =
        queryRunner.manager.getRepository(FinancialProfile);
      const transactionRepository =
        queryRunner.manager.getRepository(Transaction);

      // const financialPro = await this.financialProfileRepository.findOne({
      //   where: { userId: { id: userId } },
      // });
      const financialPro = await financialProfileRepository.findOne({
        where: { userId: { id: userId } },
      });
      if (!financialPro)
        throw new NotFoundException('El perfil del usuario no fue encontrado');

      // const newTransaction = this.transactionRepository.create({
      //   description: transactionInfo.description,
      //   transactionType: transactionInfo.transactionType,
      //   amount: transactionInfo.amount,
      //   financialProfileId: { id: financialPro.id } as FinancialProfile,
      //   categoryId: { id: transactionInfo.categoryId } as Category,
      // });
      const newTransaction = transactionRepository.create({
        description: transactionInfo.description,
        transactionType: transactionInfo.transactionType,
        amount: transactionInfo.amount,
        financialProfileId: { id: financialPro.id } as FinancialProfile,
        categoryId: { id: transactionInfo.categoryId } as Category,
      });
      await transactionRepository.save(newTransaction);

      if (transactionInfo.transactionType === TransactionEnum.Outgoing)
        financialPro.currentAmount =
          Number(financialPro.currentAmount) - Number(transactionInfo.amount);
      if (transactionInfo.transactionType === TransactionEnum.Incoming)
        financialPro.currentAmount =
          Number(financialPro.currentAmount) + Number(transactionInfo.amount);

      financialPro.currentSpent =
        Number(financialPro.currentSpent) + Number(transactionInfo.amount);

      await financialProfileRepository.save(financialPro);

      await queryRunner.commitTransaction();
      return 'Transacción guardada con éxito';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransacationById(transactionId: string, userId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: { financialProfileId: { userId: true } },
    });

    if (!transaction)
      throw new NotFoundException(
        'Esta transacción no fue encontrada en la base de datos',
      );

    if (transaction.financialProfileId.userId.id !== userId) {
      throw new ForbiddenException(
        'No tiene permisos para ver esta transacción',
      );
    }

    return transaction;
  }

  async getTransactionsByCategory(categoryId: string, userId: string) {
    const financialProfile = await this.financialProfileRepository.findOne({
      where: { userId: { id: userId } },
    });
    if (!financialProfile)
      throw new NotFoundException('Perfil financiero no encontrado');

    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.financialProfileIdId = :financialProfileId', {
        financialProfileId: financialProfile.id,
      })
      .andWhere('transaction.categoryIdId = :categoryId', { categoryId })
      .getMany();

    const totalResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COALESCE(SUM(transaction.amount), 0)', 'total')
      .where('transaction.financialProfileIdId = :financialProfileId', {
        financialProfileId: financialProfile.id,
      })
      .andWhere('transaction.categoryIdId = :categoryId', { categoryId })
      .getRawOne<{ total: string }>();

    return { transactions, total: Number(totalResult?.total ?? 0) };
  }

  async getAllTransactions(queryInfo: GetTransactionQueryDto, userId: string) {
    const { date, transactionType, category, page, limit } = queryInfo;
    const currentPage = page ?? 1;
    const pageSize = limit ?? 10;

    const financialProfile = await this.financialProfileRepository.findOne({
      where: { userId: { id: userId } },
    });
    if (!financialProfile)
      throw new NotFoundException(
        'Esta transacción no fue encontrada en la base de datos',
      );

    const transactions = await this.transactionRepository.find({
      where: {
        financialProfileId: { id: financialProfile.id },
        date: date,
        transactionType: transactionType,
        categoryId: category ? { id: category } : undefined,
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    });

    const total = transactions
      ? transactions.reduce(
          (acc, transaction) => acc + Number(transaction.amount),
          0,
        )
      : undefined;

    return { transactions, total };
  }

  async deleteTransaction(transactionId: string, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transactionRepo = queryRunner.manager.getRepository(Transaction);
      const profileRepo = queryRunner.manager.getRepository(FinancialProfile);

      const transaction = await transactionRepo.findOne({
        where: { id: transactionId },
        relations: { financialProfileId: { userId: true } }, // para poder revertir el balance
      });
      if (!transaction)
        throw new NotFoundException('Transacción no encontrada');

      if (transaction.financialProfileId.userId.id !== userId)
        throw new ForbiddenException(
          'No tiene permisos para eliminar esta transacción',
        );

      const profile = await profileRepo.findOne({
        where: { userId: { id: userId } },
      });
      if (!profile)
        throw new NotFoundException('Perfil financiero no encontrado');

      // revertir el efecto: si era gasto, se lo devuelves; si era ingreso, se lo restas
      if (transaction.transactionType === TransactionEnum.Outgoing)
        profile.currentAmount =
          Number(profile.currentAmount) + Number(transaction.amount);
      if (transaction.transactionType === TransactionEnum.Incoming)
        profile.currentAmount =
          Number(profile.currentAmount) - Number(transaction.amount);

      await profileRepo.save(profile);
      await transactionRepo.softDelete(transactionId); // ← el cambio clave, no delete()

      await queryRunner.commitTransaction();
      return 'Transacción eliminada correctamente';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    updateInfo: UpdateTransactionDto,
  ) {
    if (!updateInfo || Object.keys(updateInfo).length === 0) {
      throw new BadRequestException(
        'Debes enviar al menos un campo para actualizar',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transactionRepo = queryRunner.manager.getRepository(Transaction);
      const profileRepo = queryRunner.manager.getRepository(FinancialProfile);

      const transaction = await transactionRepo.findOne({
        where: { id: transactionId },
        relations: { financialProfileId: { userId: true } },
      });

      if (!transaction) {
        throw new NotFoundException('Transacción no encontrada');
      }

      if (transaction.financialProfileId.userId.id !== userId) {
        throw new ForbiddenException(
          'No tiene permisos para actualizar esta transacción',
        );
      }

      const profile = await profileRepo.findOne({
        where: { userId: { id: userId } },
      });

      if (!profile) {
        throw new NotFoundException('Perfil financiero no encontrado');
      }

      const oldAmount = Number(transaction.amount);
      const oldType = transaction.transactionType;

      if (oldType === TransactionEnum.Outgoing) {
        profile.currentAmount = Number(profile.currentAmount) + oldAmount;
      }

      if (oldType === TransactionEnum.Incoming) {
        profile.currentAmount = Number(profile.currentAmount) - oldAmount;
      }

      profile.currentSpent = Number(profile.currentSpent) - oldAmount;

      Object.assign(transaction, updateInfo);

      if (updateInfo.categoryId !== undefined) {
        transaction.categoryId = { id: updateInfo.categoryId } as Category;
      }

      const newAmount = Number(transaction.amount);
      const newType = transaction.transactionType;

      if (newType === TransactionEnum.Outgoing) {
        profile.currentAmount = Number(profile.currentAmount) - newAmount;
      }

      if (newType === TransactionEnum.Incoming) {
        profile.currentAmount = Number(profile.currentAmount) + newAmount;
      }

      profile.currentSpent = Number(profile.currentSpent) + newAmount;

      await transactionRepo.save(transaction);
      await profileRepo.save(profile);

      await queryRunner.commitTransaction();
      return 'Transacción actualizada correctamente';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
