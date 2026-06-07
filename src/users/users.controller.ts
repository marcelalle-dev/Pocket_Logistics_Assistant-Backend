import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async findAll() {
    return this.usersService.findAll();
  }
}
