import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  createTransaction(userId: string, transactionInfo: CreateTransactionDto) {
    return this.transactionRepository.createTransaction(
      userId,
      transactionInfo,
    );
  }
}
