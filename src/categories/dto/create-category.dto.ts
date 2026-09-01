import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría.',
    example: 'Alimentación',
    minLength: 3,
    maxLength: 30,
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 30, { message: 'El nombre puede tener entre 3 y 30 caracteres' })
  name!: string;
}
