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
import { UpdateUserDto } from './dto/update-user.dto';
import { FinancialProfileService } from '../financial-profile/financial-profile.service';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly financialProfileService: FinancialProfileService,
  ) {}

  async getAllUsers() {
    const allUsers = await this.usersRepository.find();
    if (!allUsers.length) throw new NotFoundException('No hay usuarios');

    const usersNoPassword = allUsers.map(({ password, ...user }) => user);

    return usersNoPassword;
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['financialProfile'],
    });
    if (!user)
      throw new NotFoundException(
        'El id del usuario no fue encontrado o no éxiste en la base de datos',
      );
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    return user;
  }

  async signUp(newUser: Omit<SignUpDto, 'confirmPassword'>) {
    const email = (newUser.email || '').trim().toLocaleLowerCase();
    const emailExist = await this.getUserByEmail(email);
    if (emailExist) {
      throw new BadRequestException('El email ya está registrado');
    }
    const user = this.usersRepository.create({ ...newUser, email });
    await this.usersRepository.save(user);
    await this.financialProfileService.createFinancialProfile(user);
    return 'El usuario ha sido creado correctamente';
  }

  async login(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async updateUser(userId: string, updateInfo: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const mergeUser = this.usersRepository.merge(user, updateInfo);
    const saveUser = await this.usersRepository.save(mergeUser);
    const { password, isActive, isAdmin, createdAt, ...updatedUser } = saveUser;
    return { message: 'Información actualizada exitosamente', updatedUser };
  }

  async updatePassword(user: User) {
    await this.usersRepository.save(user);
    return 'Contraseña modificada exitosamente';
  }
}
