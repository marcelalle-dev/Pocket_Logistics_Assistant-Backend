import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: number) {
    return this.prisma.expense.findMany({
      where: {
        trip: { owner_id: ownerId },
      },
      include: { trip: true, parcel: true },
    });
  }

  async create(ownerId: number, dto: CreateExpenseDto) {
    await this.ensureTripOwnedBy(dto.trip_id, ownerId);
    if (dto.parcel_id) {
      await this.ensureParcelMatchesTrip(dto.parcel_id, dto.trip_id, ownerId);
    }

    return this.prisma.expense.create({
      data: {
        amount_cfa: dto.amount_cfa,
        expense_type: dto.expense_type,
        description: dto.description,
        trip_id: dto.trip_id,
        parcel_id: dto.parcel_id,
      },
    });
  }

  async findOne(id: number, ownerId: number) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { trip: true },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    if (expense.trip.owner_id !== ownerId) {
      throw new ForbiddenException('Access denied');
    }
    return expense;
  }

  async update(id: number, ownerId: number, dto: UpdateExpenseDto) {
    const expense = await this.findOne(id, ownerId);
    if (dto.trip_id && dto.trip_id !== expense.trip_id) {
      await this.ensureTripOwnedBy(dto.trip_id, ownerId);
    }
    if (dto.parcel_id) {
      await this.ensureParcelMatchesTrip(dto.parcel_id, dto.trip_id ?? expense.trip_id, ownerId);
    }

    return this.prisma.expense.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: number, ownerId: number) {
    await this.findOne(id, ownerId);
    return this.prisma.expense.delete({ where: { id } });
  }

  private async ensureTripOwnedBy(tripId: number, ownerId: number) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.owner_id !== ownerId) {
      throw new BadRequestException('Trip not found or not accessible');
    }
  }

  private async ensureParcelMatchesTrip(parcelId: number, tripId: number, ownerId: number) {
    const parcel = await this.prisma.parcel.findUnique({ where: { id: parcelId } });
    if (!parcel || parcel.owner_id !== ownerId || parcel.trip_id !== tripId) {
      throw new BadRequestException('Parcel not found, not accessible, or does not belong to trip');
    }
  }
}
