import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { AddParcelItemDto } from './dto/add-parcel-item.dto';
import { UpdateParcelItemDto } from './dto/update-parcel-item.dto';

@Injectable()
export class ParcelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: number) {
    return this.prisma.parcel.findMany({ where: { owner_id: ownerId } });
  }

  async create(ownerId: number, dto: CreateParcelDto) {
    if (dto.trip_id) {
      await this.ensureTripOwnedBy(dto.trip_id, ownerId);
    }

    return this.prisma.parcel.create({
      data: {
        tracking_code: dto.tracking_code,
        status: dto.status,
        origin: dto.origin,
        destination: dto.destination,
        notes: dto.notes,
        owner_id: ownerId,
        trip_id: dto.trip_id,
      },
    });
  }

  async findOne(id: number, ownerId: number) {
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel) {
      throw new NotFoundException('Parcel not found');
    }
    if (parcel.owner_id !== ownerId) {
      throw new ForbiddenException('Access denied');
    }
    return parcel;
  }

  async update(id: number, ownerId: number, dto: UpdateParcelDto) {
    const parcel = await this.findOne(id, ownerId);
    if (dto.trip_id && dto.trip_id !== parcel.trip_id) {
      await this.ensureTripOwnedBy(dto.trip_id, ownerId);
    }
    return this.prisma.parcel.update({ where: { id }, data: { ...dto } });
  }

  async remove(id: number, ownerId: number) {
    await this.findOne(id, ownerId);
    return this.prisma.parcel.delete({ where: { id } });
  }

  async listItems(parcelId: number, ownerId: number) {
    await this.findOne(parcelId, ownerId);

    return this.prisma.parcel_Item.findMany({
      where: { parcel_id: parcelId },
      include: { item: true },
    });
  }

  async addItem(parcelId: number, ownerId: number, dto: AddParcelItemDto) {
    await this.findOne(parcelId, ownerId);

    const item = await this.prisma.item.findUnique({ where: { id: dto.item_id } });
    if (!item || item.owner_id !== ownerId) {
      throw new BadRequestException('Item not found or not accessible');
    }

    const existing = await this.prisma.parcel_Item.findUnique({
      where: { parcel_id_item_id: { parcel_id: parcelId, item_id: dto.item_id } },
    });
    if (existing) {
      throw new BadRequestException('Item already assigned to parcel');
    }

    return this.prisma.parcel_Item.create({
      data: {
        parcel_id: parcelId,
        item_id: dto.item_id,
        quantity_assigned: dto.quantity_assigned,
        landed_cost: dto.landed_cost,
      },
    });
  }

  async updateItem(
    parcelId: number,
    itemId: number,
    ownerId: number,
    dto: UpdateParcelItemDto,
  ) {
    await this.findOne(parcelId, ownerId);

    return this.prisma.parcel_Item.update({
      where: { parcel_id_item_id: { parcel_id: parcelId, item_id: itemId } },
      data: {
        ...dto,
      },
    });
  }

  async removeItem(parcelId: number, itemId: number, ownerId: number) {
    await this.findOne(parcelId, ownerId);

    return this.prisma.parcel_Item.delete({
      where: { parcel_id_item_id: { parcel_id: parcelId, item_id: itemId } },
    });
  }

  private async ensureTripOwnedBy(tripId: number, ownerId: number) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.owner_id !== ownerId) {
      throw new BadRequestException('Trip not found or not accessible');
    }
  }
}
