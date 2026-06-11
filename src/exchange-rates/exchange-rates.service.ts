import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';

@Injectable()
export class ExchangeRatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.exchangeRate.findMany();
  }

  async create(dto: CreateExchangeRateDto) {
    return this.prisma.exchangeRate.create({
      data: {
        from_currency: dto.from_currency,
        to_currency: dto.to_currency,
        rate: dto.rate,
      },
    });
  }

  async findOne(id: number) {
    const exchangeRate = await this.prisma.exchangeRate.findUnique({ where: { id } });
    if (!exchangeRate) {
      throw new NotFoundException('Exchange rate not found');
    }
    return exchangeRate;
  }

  async update(id: number, dto: UpdateExchangeRateDto) {
    await this.findOne(id);
    return this.prisma.exchangeRate.update({ where: { id }, data: { ...dto } });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.exchangeRate.delete({ where: { id } });
  }
}
