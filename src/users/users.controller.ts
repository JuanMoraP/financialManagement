import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Guardian para solo admin, hace falta que no reciba la contraseña
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  //Guardian para solo admin, hace falta que no reciba la contraseña
  @Get('email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  //Guardian para solo admin, hace falta que no reciba la contraseña
  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }
}
