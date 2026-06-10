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
import { TripsService } from './trips.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Controller('trips')
@UseGuards(JwtGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  async findAll(@CurrentUser() user: { id: number }) {
    return this.tripsService.findAll(user.id);
  }

  @Post()
  async create(@CurrentUser() user: { id: number }, @Body() dto: CreateTripDto) {
    return this.tripsService.create(user.id, dto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.tripsService.findOne(id, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, user.id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.tripsService.remove(id, user.id);
  }
}
