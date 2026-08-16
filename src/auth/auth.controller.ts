/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { userLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() newUser: SignUpDto) {
    return await this.authService.signUp(newUser);
  }

  @Post('login')
  login(@Body() credentials: userLoginDto) {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  async refresh(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request: Request) {
    return await this.authService.logout(request['user'].sub);
  }
}
