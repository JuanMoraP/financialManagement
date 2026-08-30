import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { Request } from 'express';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionQueryDto } from './dto/get-transaction-with-query.dto';

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

  @Get(':id')
  @UseGuards(AuthGuard)
  getTransactionById(
    @Req() request: Request,
    @Param('id', ParseUUIDPipe) transactionId: string,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.getTransactionById(transactionId, userId);
  }

  @Get('allTransactions')
  @UseGuards(AuthGuard)
  getAllTransactions(
    @Query() queryInfo: GetTransactionQueryDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.getAllTransactions(queryInfo, userId);
  }

  @Delete('delete-transaction/:id')
  @UseGuards(AuthGuard)
  deleteTransactions(
    @Param('id', ParseUUIDPipe) transactionId: string,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.deleteTransaction(transactionId, userId);
  }
}
