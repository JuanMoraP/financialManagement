import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionQueryDto } from './dto/get-transaction-with-query.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  createTransaction(userId: string, transactionInfo: CreateTransactionDto) {
    return this.transactionRepository.createTransaction(
      userId,
      transactionInfo,
    );
  }

  getTransactionById(transactionId: string, userId: string) {
    return this.transactionRepository.getTransacationById(
      transactionId,
      userId,
    );
  }

  getAllTransactions(queryInfo: GetTransactionQueryDto, userId: string) {
    return this.transactionRepository.getAllTransactions(queryInfo, userId);
  }

  deleteTransaction(transactionId: string, userId: string) {
    return this.transactionRepository.deleteTransaction(transactionId, userId);
  }

  updateTransaction(
    transactionId: string,
    userId: string,
    transactionInfo: CreateTransactionDto,
  ) {
    return this.transactionRepository.updateTransaction(
      userId,
      transactionId,
      transactionInfo,
    );
  }
}
