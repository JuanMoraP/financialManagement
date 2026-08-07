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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
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

    const payload = {
      sub: user.id,
      username: user.name,
      useremail: user.email,
    };
    const token = await this.jwtService.signAsync(payload);
    return { message: 'Acceso concedido', token };
  }
}
