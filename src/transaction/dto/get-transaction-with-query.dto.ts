import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { TransactionEnum } from '../../common/enum/transaction.enum';
import { Type } from 'class-transformer';

export class GetTransactionQueryDto {
  @ApiPropertyOptional({
    description: 'Fecha de la transacción.',
    example: '2026-08-31',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiPropertyOptional({
    description: 'Tipo de transacción para filtrar.',
    enum: TransactionEnum,
    example: TransactionEnum.Incoming,
  })
  @IsOptional()
  @IsEnum(TransactionEnum, {
    message: 'El tipo de transacción puede ser de entrada o de salida',
  })
  transactionType?: TransactionEnum;

  @ApiPropertyOptional({
    description: 'UUID de la categoría para filtrar.',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsOptional()
  @IsString({ message: 'La categoría debe ser un id valido' })
  @IsUUID('4', { message: 'El id de la categoría debe ser un UUID válido' })
  category?: string;

  @ApiPropertyOptional({
    description: 'Número de página.',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Límite de resultados por página.',
    example: 10,
    minimum: 1,
    maximum: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Max(10)
  limit?: number;
}
