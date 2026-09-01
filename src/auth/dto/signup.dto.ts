import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Nombre completo del usuario.',
    example: 'Ana García',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 50, { message: 'El nombre puede tener entre 3 y 50 caracteres' })
  name!: string;

  @ApiProperty({
    description: 'Edad del usuario.',
    example: 28,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'La edad debe ser un número' },
  )
  age!: number;

  @ApiProperty({
    description: 'Correo electrónico del usuario.',
    example: 'ana.garcia@email.com',
  })
  @IsNotEmpty({ message: 'Es necesario agregar un email' })
  @IsEmail({}, { message: 'Debe poner un email valido' })
  email!: string;

  @ApiProperty({
    description:
      'Contraseña con al menos una mayúscula, minúscula, número y símbolo.',
    example: 'Pass123!$',
    minLength: 8,
    maxLength: 40,
  })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'La contraseña no cumple con los requisitos',
  })
  @Length(8, 40, {
    message: 'La contraseña debe tener entre 8 y 40 caracteres',
  })
  password!: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña.',
    example: 'Pass123!$',
  })
  @IsNotEmpty({ message: 'La confirmación de contraseña no puede estar vacía' })
  @IsString({
    message: 'La confirmación de contraseña debe ser una cadena de texto',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'La contraseña no cumple con los requisitos',
  })
  @Length(8, 40, {
    message: 'La contraseña debe tener entre 8 y 40 caracteres',
  })
  confirmPassword!: string;

  @ApiProperty({
    description: 'Fecha de nacimiento en formato ISO.',
    example: '1996-05-14',
  })
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe tener un formato valido' },
  )
  @IsNotEmpty({ message: 'La fecha de nacimiento no puede estar vacia' })
  birthdate!: string;

  @ApiProperty({
    description: 'País de residencia.',
    example: 'Colombia',
  })
  @IsNotEmpty({ message: 'El país no puede estar vacio' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  country!: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario.',
    example: '3001234567',
    minLength: 10,
    maxLength: 11,
  })
  @IsNotEmpty({ message: 'El teléfono no puede estar vacio' })
  @IsString({ message: 'Debe ser un número valido' })
  @Length(10, 11, { message: 'El número de telefono no es correcto' })
  phone!: string;
}
