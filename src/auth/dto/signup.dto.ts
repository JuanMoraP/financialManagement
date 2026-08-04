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
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 50, { message: 'El nombre puede tener entre 3 y 50 caracteres' })
  name!: string;

  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'La edad debe ser un número' },
  )
  age!: number;

  @IsNotEmpty({ message: 'Es necesario agregar un email' })
  @IsEmail({}, { message: 'Debe poner un email valido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'La contraseña no cumple con los requisitos',
  })
  @Length(8, 40, {
    message: 'La contraseña debe tener entre 8 y 40 caracteres',
  })
  password!: string;

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

  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe tener un formato valido' },
  )
  @IsNotEmpty({ message: 'La fecha de nacimiento no puede estar vacia' })
  birthdate!: string;

  @IsNotEmpty({ message: 'El país no puede estar vacio' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  country!: string;

  @IsNotEmpty({ message: 'El teléfono no puede estar vacio' })
  @IsString({ message: 'Debe ser un número valido' })
  @Length(10, 11, { message: 'El número de telefono no es correcto' })
  phone!: string;
}
