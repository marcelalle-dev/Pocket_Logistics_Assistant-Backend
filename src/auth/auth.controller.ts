import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return this.authService.login(user);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.id);
  }
}
