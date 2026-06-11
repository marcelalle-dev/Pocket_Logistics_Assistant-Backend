import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';

@Controller('exchange-rates')
@UseGuards(JwtGuard)
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get()
  async findAll() {
    return this.exchangeRatesService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateExchangeRateDto) {
    return this.exchangeRatesService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exchangeRatesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExchangeRateDto,
  ) {
    return this.exchangeRatesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.exchangeRatesService.remove(id);
  }
}
