import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialProfile } from './entities/financial-profile.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';

@Injectable()
export class FinancialProfileRepository {
  constructor(
    @InjectRepository(FinancialProfile)
    private readonly financialProfileRepository: Repository<FinancialProfile>,
  ) {}

  async createFinancialProfile(user: User) {
    const financialProFound = await this.financialProfileRepository.findOne({
      where: { userId: { id: user.id } },
    });
    if (!financialProFound)
      throw new NotFoundException('El perfil financiero ya existe');

    const newFinancialProfile = this.financialProfileRepository.create({
      userId: { id: user.id } as User,
    });
    await this.financialProfileRepository.save(newFinancialProfile);
    return 'Perfil financiero creado';
  }
}
