import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { userLoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() newUser: SignUpDto) {
    return await this.authService.signUp(newUser);
  }

  @Post('login')
  login(@Body() credentials: userLoginDto) {
    return this.authService.logim(credentials);
  }
}
