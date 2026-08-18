import { Injectable } from '@nestjs/common';
import { FinancialProfileRepository } from './financial-profile.repository';
import { User } from '../users/entities/users.entity';

@Injectable()
export class FinancialProfileService {
  constructor(
    private readonly financialProfileRepository: FinancialProfileRepository,
  ) {}

  createFinancialProfile(user: User) {
    return this.financialProfileRepository.createFinancialProfile(user);
  }
}
