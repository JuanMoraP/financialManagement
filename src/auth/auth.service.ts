/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { userLoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async signUp(newUser: SignUpDto) {
    if (newUser.password !== newUser.confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const { confirmPassword, ...newUserInfo } = newUser;

    return await this.usersRepository.signUp({
      ...newUserInfo,
      password: hashedPassword,
    });
  }

  async login(credentials: userLoginDto) {
    const { email, password } = credentials;
    const user = await this.usersRepository.login(email);
    if (!user)
      throw new NotFoundException('El usuario no tiene una cuenta activa');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('La contraseña es incorrecta');

    const tokens = await this.generateTokens(user.id, user.name, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return { message: 'Acceso concedido', tokens };
  }

  //Método que genera ambos tokens
  private async generateTokens(
    userId: string,
    username: string,
    useremail: string,
  ) {
    const payload = {
      sub: userId,
      username,
      useremail,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  //Método nuevo: hashea el refresh token y lo guarda (o actualiza) en BD
  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const existing = await this.refreshTokenRepository.findOne({
      where: { userId: { id: userId } },
    });
    if (existing) {
      existing.hashedToken = hashedToken;
      existing.expiresAt = expiresAt;
      await this.refreshTokenRepository.save(existing);
    } else {
      const newRefreshToken = this.refreshTokenRepository.create({
        hashedToken: hashedToken,
        expiresAt,
        userId: { id: userId } as User,
      });
      await this.refreshTokenRepository.save(newRefreshToken);
    }
  }

  async refresh(refreshToken: RefreshTokenDto) {
    const tokenString = refreshToken.refreshToken;

    // 1. Verificar la firma y que no haya expirado
    let payload: { sub: string; username: string; useremail: string };
    try {
      payload = await this.jwtService.verifyAsync(tokenString, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalido o expirado');
    }

    // 2. Buscar el refresh token guardado para este usuario
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { userId: { id: payload.sub } },
    });
    if (!storedToken) {
      throw new UnauthorizedException('No hay sesión activa para este usuario');
    }

    // 3. Comparar el token recibido contra el hash guardado
    const matches = await bcrypt.compare(tokenString, storedToken.hashedToken);
    if (!matches) {
      throw new UnauthorizedException('Refresh token invalido');
    }

    // Todo OK: generamos tokens nuevos y rotamos el refresh token
    const tokens = await this.generateTokens(
      payload.sub,
      payload.username,
      payload.useremail,
    );
    await this.saveRefreshToken(payload.sub, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.refreshTokenRepository.delete({ userId: { id: userId } });
    return { message: 'Sesión cerrada con éxito' };
  }
}
