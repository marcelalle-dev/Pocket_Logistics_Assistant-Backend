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
import { ParcelsService } from './parcels.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { AddParcelItemDto } from './dto/add-parcel-item.dto';
import { UpdateParcelItemDto } from './dto/update-parcel-item.dto';

@Controller('parcels')
@UseGuards(JwtGuard)
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Get()
  async findAll(@CurrentUser() user: { id: number }) {
    return this.parcelsService.findAll(user.id);
  }

  @Post()
  async create(@CurrentUser() user: { id: number }, @Body() dto: CreateParcelDto) {
    return this.parcelsService.create(user.id, dto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.parcelsService.findOne(id, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateParcelDto,
  ) {
    return this.parcelsService.update(id, user.id, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.parcelsService.remove(id, user.id);
  }

  @Get(':id/items')
  async findItems(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.parcelsService.listItems(id, user.id);
  }

  @Post(':id/items')
  async addItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: AddParcelItemDto,
  ) {
    return this.parcelsService.addItem(id, user.id, dto);
  }

  @Patch(':id/items/:itemId')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateParcelItemDto,
  ) {
    return this.parcelsService.updateItem(id, itemId, user.id, dto);
  }

  @Delete(':id/items/:itemId')
  async removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.parcelsService.removeItem(id, itemId, user.id);
  }
}
