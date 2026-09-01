import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CurrencyEnum } from '../../common/enum/currency.enum';

export class UpdateFinancialProfileDto {
  @ApiPropertyOptional({
    description: 'Monto inicial del perfil financiero.',
    example: 2500,
  })
  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El monto inicial debe ser un número' },
  )
  initialAmount?: number;

  @ApiPropertyOptional({
    description: 'Monto actual disponible.',
    example: 3200,
  })
  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El monto actual debe ser un número' },
  )
  currentAmount?: number;

  @ApiPropertyOptional({
    description: 'Ingreso mensual actual.',
    example: 4800,
  })
  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El ingreso actual debe ser un número' },
  )
  currentIncome?: number;

  @ApiPropertyOptional({
    description: 'Gasto actual del usuario.',
    example: 2100,
  })
  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El monto inicial debe ser un número' },
  )
  currentSpent?: number;

  @ApiPropertyOptional({
    description: 'Meta mensual de ahorro.',
    example: 500,
  })
  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El monto inicial debe ser un número' },
  )
  monthlySavingsGoal?: number;

  @ApiPropertyOptional({
    description: 'Moneda preferida del perfil.',
    enum: CurrencyEnum,
    example: CurrencyEnum.COP,
  })
  @IsOptional()
  @IsEnum(CurrencyEnum, {
    message: 'La moneda puede ser USD, CAD, EUR, GBP, ARS, MXN, COP, ',
  })
  currency?: CurrencyEnum;

  @ApiPropertyOptional({
    description: 'Banco preferido del usuario.',
    example: 'Banco de Bogotá',
  })
  @IsOptional()
  @IsString({ message: 'Puede poner el nombre de su banco' })
  preferredBank?: string;
}
