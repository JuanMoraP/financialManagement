import { OmitType, PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from '../../auth/dto/signup.dto';

export class UpdateUserDto extends PartialType(
  OmitType(SignUpDto, ['password', 'confirmPassword'] as const),
) {}
