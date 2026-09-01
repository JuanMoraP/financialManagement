import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FinancialProfileService } from './financial-profile.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateFinancialProfileDto } from './dto/financial-profile.dto';
import type { Request } from 'express';

@ApiTags('Financial Profile')
@Controller('financial-profile')
export class FinancialProfileController {
  constructor(
    private readonly financialProfileService: FinancialProfileService,
  ) {}

  @Patch('update-financial-profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar el perfil financiero del usuario autenticado',
  })
  @ApiBody({ type: UpdateFinancialProfileDto })
  @ApiResponse({ status: 200, description: 'Perfil financiero actualizado.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mi perfil financiero' })
  @ApiResponse({ status: 200, description: 'Datos del perfil financiero.' })
  getMyFinancialProfile(@Req() request: Request) {
    const userId = request['user'].sub;
    return this.financialProfileService.getMyFinancialProfile(userId);
  }
}
