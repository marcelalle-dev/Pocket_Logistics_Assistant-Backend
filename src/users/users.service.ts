import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import * as path from 'path';

type PublicUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  private readonly fallbackFile = path.join(process.cwd(), 'dev_users.json');
  private useFileStore = false;
  private logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async readFileStore(): Promise<User[]> {
    try {
      const content = await fs.readFile(this.fallbackFile, 'utf8');
      return JSON.parse(content) as User[];
    } catch (err) {
      return [];
    }
  }

  private async writeFileStore(users: User[]) {
    await fs.writeFile(this.fallbackFile, JSON.stringify(users, null, 2), 'utf8');
  }

  private async enableFileStore(): Promise<void> {
    this.useFileStore = true;
    this.logger.warn('Using local file store for users (dev_users.json)');
  }

  private async safePrismaCall<T>(fn: () => Promise<T>): Promise<T> {
    if (this.useFileStore) {
      throw new Error('FileStoreEnabled');
    }
    try {
      return await fn();
    } catch (err: any) {
      // Detect Prisma P1000 (authentication) or connection issues and fallback
      if (err?.code === 'P1000' || /AuthenticationFailed|connect/i.test(String(err))) {
        await this.enableFileStore();
        throw new Error('FileStoreEnabled');
      }
      throw err;
    }
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Try DB first
    try {
      return await this.safePrismaCall(() =>
        this.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: 'AGENT',
          },
        }),
      );
    } catch (e) {
      // Fallback to file store
      const users = await this.readFileStore();
      const nextId = users.length ? Math.max(...users.map((u) => u.id || 0)) + 1 : 1;
      const now = new Date().toISOString();
      const user: User = {
        id: nextId,
        name,
        email,
        password: hashedPassword,
        role: 'AGENT',
        created_at: now as any,
        updated_at: now as any,
      } as User;
      users.push(user);
      await this.writeFileStore(users);
      return user;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.safePrismaCall(() => this.prisma.user.findUnique({ where: { email } }));
    } catch (e) {
      if (String(e) === 'Error: FileStoreEnabled') {
        const users = await this.readFileStore();
        return users.find((u) => u.email === email) ?? null;
      }
      throw e;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.safePrismaCall(() => this.prisma.user.findUnique({ where: { id } }));
    } catch (e) {
      if (String(e) === 'Error: FileStoreEnabled') {
        const users = await this.readFileStore();
        return users.find((u) => u.id === id) ?? null;
      }
      throw e;
    }
  }

  async findPublicById(id: number): Promise<PublicUser | null> {
    try {
      return await this.safePrismaCall(() =>
        this.prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
            updated_at: true,
          },
        }),
      );
    } catch (e) {
      if (String(e) === 'Error: FileStoreEnabled') {
        const users = await this.readFileStore();
        const u = users.find((x) => x.id === id);
        if (!u) return null;
        const { password, ...pub } = u as any;
        return pub as PublicUser;
      }
      throw e;
    }
  }

  async findAll(): Promise<PublicUser[]> {
    try {
      return await this.safePrismaCall(() =>
        this.prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
            updated_at: true,
          },
        }),
      );
    } catch (e) {
      if (String(e) === 'Error: FileStoreEnabled') {
        const users = await this.readFileStore();
        return users.map((u) => {
          const { password, ...pub } = u as any;
          return pub as PublicUser;
        });
      }
      throw e;
    }
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
