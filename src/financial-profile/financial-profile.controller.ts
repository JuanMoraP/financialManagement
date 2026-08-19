import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { FinancialProfileService } from './financial-profile.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateFinancialProfileDto } from './dto/financial-profile.dto';
import type { Request } from 'express';

@Controller('financial-profile')
export class FinancialProfileController {
  constructor(
    private readonly financialProfileService: FinancialProfileService,
  ) {}

  @Patch('update-financial-profile')
  @UseGuards(AuthGuard)
  updateFinancialProfile(
    @Body() updatedInfo: UpdateFinancialProfileDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return this.financialProfileService.updateFinancialProfile(
      userId,
      updatedInfo,
    );
  }

  @Get('my-financial-pro')
  @UseGuards(AuthGuard)
  getMyFinancialProfile(@Req() request: Request) {
    const userId = request['user'].sub;
    return this.financialProfileService.getMyFinancialProfile(userId);
  }
}
