import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: number) {
    return this.prisma.item.findMany({ where: { owner_id: ownerId } });
  }

  async create(ownerId: number, dto: CreateItemDto) {
    await this.ensureCategoryExists(dto.category_id);
    if (dto.trip_id) {
      await this.ensureTripOwnedBy(dto.trip_id, ownerId);
    }

    return this.prisma.item.create({
      data: {
        name: dto.name,
        description: dto.description,
        unit_price: dto.unit_price,
        currency: dto.currency ?? 'XOF',
        exchange_rate_at_purchase: dto.exchange_rate_at_purchase,
        photo_url: dto.photo_url,
        quantity: dto.quantity ?? 1,
        category_id: dto.category_id,
        owner_id: ownerId,
        trip_id: dto.trip_id,
      },
    });
  }

  async findOne(id: number, ownerId: number) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (item.owner_id !== ownerId) {
      throw new ForbiddenException('Access denied');
    }
    return item;
  }

  async update(id: number, ownerId: number, dto: UpdateItemDto) {
    const item = await this.findOne(id, ownerId);

    if (dto.category_id && dto.category_id !== item.category_id) {
      await this.ensureCategoryExists(dto.category_id);
    }
    if (dto.trip_id && dto.trip_id !== item.trip_id) {
      await this.ensureTripOwnedBy(dto.trip_id, ownerId);
    }

    return this.prisma.item.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: number, ownerId: number) {
    await this.findOne(id, ownerId);
    return this.prisma.item.delete({ where: { id } });
  }

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
  }

  private async ensureTripOwnedBy(tripId: number, ownerId: number) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.owner_id !== ownerId) {
      throw new BadRequestException('Trip not found or not accessible');
    }
  }
}
