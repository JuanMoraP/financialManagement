import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from './signup.dto';

export class userLoginDto extends PickType(SignUpDto, ['email', 'password']) {}
