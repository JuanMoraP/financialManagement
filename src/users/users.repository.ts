import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/signup.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  getAllUsers() {
    const allUsers = this.usersRepository.find();
    return allUsers;
  }

  getUserById(id: string) {
    const user = this.usersRepository.findOne({ where: { id: id } });
    return user;
  }

  getUserByEmail(email: string) {
    const user = this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async signUp(newUser: SignUpDto) {
    const email = (newUser.email || '').trim().toLocaleLowerCase();
    const emailExist = await this.getUserByEmail(email);
    if (emailExist) {
      throw new BadRequestException('El email ya está registrado');
    }

    const user = this.usersRepository.create({ ...newUser, email });
    await this.usersRepository.save(user);

    return 'El usuario ha sido creado correctamente';
  }
}
