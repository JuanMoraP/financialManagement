import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { Request } from 'express';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create-transaction')
  @UseGuards(AuthGuard)
  createTransaction(
    @Req() request: Request,
    @Body() transactionInfo: CreateTransactionDto,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.createTransaction(userId, transactionInfo);
  }
}
