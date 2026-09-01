/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from '../auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getAllUsers() {
    return this.usersRepository.getAllUsers();
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.getUserById(id);
    const { password, ...userNoPassword } = user;
    return userNoPassword;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user)
      throw new NotFoundException(
        'El email no fue encontrado o no éxiste en la base de datos',
      );

    const { password, ...userNoPassword } = user;
    return userNoPassword;
  }

  updateUser(userId: string, updateInfo: UpdateUserDto) {
    return this.usersRepository.updateUser(userId, updateInfo);
  }

  async updatePassword(userId: string, updateInfo: UpdatePasswordDto) {
    const user = await this.usersRepository.getUserById(userId);
    const isMatch = await bcrypt.compare(
      updateInfo.currentPassword,
      user.password,
    );
    if (!isMatch)
      throw new UnauthorizedException('La contraseña es incorrecta');
    if (updateInfo.newPassword !== updateInfo.confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');
    const hashedPassword = await bcrypt.hash(updateInfo.newPassword, 10);
    user.password = hashedPassword;
    return await this.usersRepository.updatePassword(user);
  }

  async inactiveUser(userId: string) {
    return this.usersRepository.inactiveUser(userId);
  }
}
