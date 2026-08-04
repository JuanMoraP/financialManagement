import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

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
}
