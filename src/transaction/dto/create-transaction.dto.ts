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
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @Length(3, 50, {
    message: 'La descripción puede tener entre 3 y 50 caracteres',
  })
  description!: string;

  @IsEnum(TransactionEnum, {
    message: 'El tipo de transacción puede ser de entrada o de salida',
  })
  transactionType!: TransactionEnum;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El valor debe ser un número con máximo 2 decimales' },
  )
  @IsNotEmpty({ message: 'El valor no puede estar vacio' })
  @IsPositive({ message: 'El valor debe ser mayor a cero' })
  amount!: number;

  @IsNotEmpty({ message: 'La categoría no puede estar vacía' })
  @IsString({ message: 'La categoría debe ser un id valido' })
  @IsUUID('4', { message: 'El id de la categoría debe ser un UUID válido' })
  categoryId!: string;
}
