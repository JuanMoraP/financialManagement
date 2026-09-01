import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialProfile } from './entities/financial-profile.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { UpdateFinancialProfileDto } from './dto/financial-profile.dto';

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
    if (financialProFound)
      throw new BadRequestException('El perfil financiero ya existe');

    const newFinancialProfile = this.financialProfileRepository.create({
      userId: { id: user.id } as User,
    });
    await this.financialProfileRepository.save(newFinancialProfile);
    return 'Perfil financiero creado';
  }

  async updateFinancialProfile(
    userId: string,
    updatedInfo: UpdateFinancialProfileDto,
  ) {
    const financialProfile = await this.financialProfileRepository.findOne({
      where: { userId: { id: userId } },
    });
    if (!financialProfile)
      throw new NotFoundException('Perfil financiero no encontrado');

    const mergedFinancialProfile = this.financialProfileRepository.merge(
      financialProfile,
      updatedInfo,
    );
    const newFinPro = await this.financialProfileRepository.save(
      mergedFinancialProfile,
    );
    return { message: 'Perfil financiero actualizado', newFinPro };
  }

  async getMyFinancialProfile(userId: string) {
    const financialProfile = await this.financialProfileRepository.findOne({
      where: { userId: { id: userId } },
    });
    if (!financialProfile)
      throw new NotFoundException('Perfil financiero no encontrado');
    return financialProfile;
  }
}
