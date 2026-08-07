/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/signup.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    const allUsers = await this.usersRepository.find();
    if (!allUsers.length) throw new NotFoundException('No hay usuarios');

    const usersNoPassword = allUsers.map(({ password, ...user }) => user);

    return usersNoPassword;
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user)
      throw new NotFoundException(
        'El id del usuario no fue encontrado o no éxiste en la base de datos',
      );

    const { password, ...userNoPassword } = user;

    return userNoPassword;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException(
        'El email no fue encontrado o no éxiste en la base de datos',
      );

    const { password, ...userNoPassword } = user;

    return userNoPassword;
  }

  async signUp(newUser: Omit<SignUpDto, 'confirmPassword'>) {
    const email = (newUser.email || '').trim().toLocaleLowerCase();
    const emailExist = await this.getUserByEmail(email);
    if (emailExist) {
      throw new BadRequestException('El email ya está registrado');
    }

    const user = this.usersRepository.create({ ...newUser, email });
    await this.usersRepository.save(user);

    return 'El usuario ha sido creado correctamente';
  }

  async login(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }
}
