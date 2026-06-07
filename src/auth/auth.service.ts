import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Cet email est deja utilise');
    }

    const user = await this.usersService.create(name, email, password);
    return this.login(user);
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findPublicById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }
}
