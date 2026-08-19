import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CurrencyEnum } from '../../common/enum/currency.enum';

export class UpdateFinancialProfileDto {
  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El monto inicial debe ser un número' },
  )
  initialAmount?: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El monto actual debe ser un número' },
  )
  currentAmount?: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El ingreso actual debe ser un número' },
  )
  currentIncome?: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El monto inicial debe ser un número' },
  )
  currentSpent?: number;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El monto inicial debe ser un número' },
  )
  monthlySavingsGoal?: number;

  @IsOptional()
  @IsEnum(CurrencyEnum, {
    message: 'La moneda puede ser USD, CAD, EUR, GBP, ARS, MXN, COP, ',
  })
  currency?: CurrencyEnum;

  @IsOptional()
  @IsString({ message: 'Puede poner el nombre de su banco' })
  preferredBank?: string;
}
