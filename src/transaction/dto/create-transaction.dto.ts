import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { TransactionEnum } from '../../common/enum/transaction.enum';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Descripción breve de la transacción.',
    example: 'Pago de supermercado',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @Length(3, 50, {
    message: 'La descripción puede tener entre 3 y 50 caracteres',
  })
  description!: string;

  @ApiProperty({
    description: 'Tipo de transacción.',
    enum: TransactionEnum,
    example: TransactionEnum.Outgoing,
  })
  @IsEnum(TransactionEnum, {
    message: 'El tipo de transacción puede ser de entrada o de salida',
  })
  transactionType!: TransactionEnum;

  @ApiProperty({
    description: 'Monto de la transacción.',
    example: 125.5,
    minimum: 0,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El valor debe ser un número con máximo 2 decimales' },
  )
  @IsNotEmpty({ message: 'El valor no puede estar vacio' })
  @IsPositive({ message: 'El valor debe ser mayor a cero' })
  amount!: number;

  @ApiProperty({
    description: 'UUID de la categoría asociada.',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsNotEmpty({ message: 'La categoría no puede estar vacía' })
  @IsString({ message: 'La categoría debe ser un id valido' })
  @IsUUID('4', { message: 'El id de la categoría debe ser un UUID válido' })
  categoryId!: string;
}
