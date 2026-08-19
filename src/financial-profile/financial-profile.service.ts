/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { FinancialProfileRepository } from './financial-profile.repository';
import { User } from '../users/entities/users.entity';
import { UpdateFinancialProfileDto } from './dto/financial-profile.dto';

@Injectable()
export class FinancialProfileService {
  constructor(
    private readonly financialProfileRepository: FinancialProfileRepository,
  ) {}

  createFinancialProfile(user: User) {
    return this.financialProfileRepository.createFinancialProfile(user);
  }

  updateFinancialProfile(
    userId: string,
    updatedInfo: UpdateFinancialProfileDto,
  ) {
    return this.financialProfileRepository.updateFinancialProfile(
      userId,
      updatedInfo,
    );
  }

  async getMyFinancialProfile(userId: string) {
    const finPro =
      await this.financialProfileRepository.getMyFinancialProfile(userId);

    const { id, createdAt, ...financialProfile } = finPro;
    return financialProfile;
  }
}
