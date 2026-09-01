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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { Request } from 'express';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionQueryDto } from './dto/get-transaction-with-query.dto';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create-transaction')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva transacción' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Transacción creada exitosamente.' })
  createTransaction(
    @Req() request: Request,
    @Body() transactionInfo: CreateTransactionDto,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.createTransaction(userId, transactionInfo);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener una transacción por id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Transacción encontrada.' })
  getTransactionById(
    @Req() request: Request,
    @Param('id', ParseUUIDPipe) transactionId: string,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.getTransactionById(transactionId, userId);
  }

  @Get('category/:categoryId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener transacciones por categoría' })
  @ApiParam({ name: 'categoryId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Transacciones por categoría.' })
  getTransactionsByCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.getTransactionsByCategory(
      categoryId,
      userId,
    );
  }

  @Get('allTransactions')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todas las transacciones con filtros opcionales',
  })
  @ApiQuery({ name: 'date', required: false, type: String })
  @ApiQuery({
    name: 'transactionType',
    required: false,
    enum: ['incoming', 'outgoing'],
  })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de transacciones filtradas.',
  })
  getAllTransactions(
    @Query() queryInfo: GetTransactionQueryDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.getAllTransactions(queryInfo, userId);
  }

  @Delete('delete-transaction/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una transacción' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Transacción eliminada.' })
  deleteTransactions(
    @Param('id', ParseUUIDPipe) transactionId: string,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.deleteTransaction(transactionId, userId);
  }

  @Post('update-transaction/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una transacción existente' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 200, description: 'Transacción actualizada.' })
  updateTransaction(
    @Param('id', ParseUUIDPipe) transactionId: string,
    @Req() request: Request,
    @Body() updateInfo: CreateTransactionDto,
  ) {
    const userId = request['user'].sub;
    return this.transactionService.updateTransaction(
      userId,
      transactionId,
      updateInfo,
    );
  }
}
