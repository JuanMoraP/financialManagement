import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual del usuario.',
    example: 'Pass123!$',
  })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  currentPassword!: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario.',
    example: 'NewPass456!$',
  })
  @IsNotEmpty({ message: 'La nueva contraseña no puede estar vacía' })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message: 'La nueva contraseña no cumple con los requisitos',
  })
  @Length(8, 40, {
    message: 'La nueva contraseña debe tener entre 8 y 40 caracteres',
  })
  newPassword!: string;

  @ApiProperty({
    description: 'Confirmación de la nueva contraseña.',
    example: 'NewPass456!$',
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
}
