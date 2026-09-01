import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { userLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './guards/auth.guard';
import type { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos.' })
  async signUp(@Body() newUser: SignUpDto) {
    return await this.authService.signUp(newUser);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener tokens' })
  @ApiBody({ type: userLoginDto })
  @ApiResponse({ status: 200, description: 'Credenciales válidas.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() credentials: userLoginDto) {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar el token de acceso' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token renovado correctamente.' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido.' })
  async refresh(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión del usuario actual' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada correctamente.' })
  @ApiResponse({ status: 401, description: 'Token no válido o ausente.' })
  async logout(@Req() request: Request) {
    return await this.authService.logout(request['user'].sub);
  }
}
