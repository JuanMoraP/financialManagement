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
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsEnum(TransactionEnum, {
    message: 'El tipo de transacción puede ser de entrada o de salida',
  })
  transactionType?: TransactionEnum;

  @IsOptional()
  @IsString({ message: 'La categoría debe ser un id valido' })
  @IsUUID('4', { message: 'El id de la categoría debe ser un UUID válido' })
  category?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Max(10)
  limit?: number;
}
