import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: number) {
    return this.prisma.trip.findMany({ where: { owner_id: ownerId } });
  }

  async create(ownerId: number, dto: CreateTripDto) {
    const data = {
      name: dto.name,
      start_date: new Date(dto.start_date),
      end_date: dto.end_date ? new Date(dto.end_date) : undefined,
      owner_id: ownerId,
    };

    return this.prisma.trip.create({ data });
  }

  private async findById(id: number) {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async findOne(id: number, ownerId: number) {
    const trip = await this.findById(id);
    if (trip.owner_id !== ownerId) throw new ForbiddenException('Access denied');
    return trip;
  }

  async update(id: number, ownerId: number, dto: UpdateTripDto) {
    const trip = await this.findById(id);
    if (trip.owner_id !== ownerId) throw new ForbiddenException('Access denied');

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.start_date !== undefined) data.start_date = new Date(dto.start_date);
    if (dto.end_date !== undefined) data.end_date = dto.end_date ? new Date(dto.end_date) : null;

    return this.prisma.trip.update({ where: { id }, data });
  }

  async remove(id: number, ownerId: number) {
    const trip = await this.findById(id);
    if (trip.owner_id !== ownerId) throw new ForbiddenException('Access denied');
    return this.prisma.trip.delete({ where: { id } });
  }
}
