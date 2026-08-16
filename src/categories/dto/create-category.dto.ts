import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategorieDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 30, { message: 'El nombre puede tener entre 3 y 30 caracteres' })
  name!: string;
}
