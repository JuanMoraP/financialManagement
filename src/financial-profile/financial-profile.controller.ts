import { Controller } from '@nestjs/common';
import { FinancialProfileService } from './financial-profile.service';

@Controller('financial-profile')
export class FinancialProfileController {
  constructor(private readonly financialProfileService: FinancialProfileService) {}
}
