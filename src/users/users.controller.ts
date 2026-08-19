import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Guardian para solo admin, hace falta que no reciba la contraseña
  @Get('get-all-users')
  @UseGuards(AuthGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  //Guardian para solo admin, hace falta que no reciba la contraseña
  @Get('email/:email')
  @UseGuards(AuthGuard)
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  //Guardian para solo admin, hace falta que no reciba la contraseña
  @Get(':id')
  @UseGuards(AuthGuard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch('update-user')
  @UseGuards(AuthGuard)
  updateUser(@Req() request: Request, @Body() updatedInfo: UpdateUserDto) {
    const userId = request['user'].sub;
    return this.usersService.updateUser(userId, updatedInfo);
  }

  @Patch('update-password')
  @UseGuards(AuthGuard)
  updatePassword(
    @Req() request: Request,
    @Body() updatedPassword: UpdatePasswordDto,
  ) {
    const userId = request['user'].sub;
    return this.usersService.updatePassword(userId, updatedPassword);
  }
}
