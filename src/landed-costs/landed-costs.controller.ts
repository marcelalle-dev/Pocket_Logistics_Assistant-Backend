import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LandedCostsService } from './landed-costs.service';
import { CalculateLandedCostDto } from './dto/calculate-landed-cost.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('landed-costs')
@UseGuards(JwtGuard)
export class LandedCostsController {
  constructor(private readonly service: LandedCostsService) {}

  @Post('calculate')
  async calculate(@Body() body: CalculateLandedCostDto) {
    return this.service.calculate(body.items, body.additional_fees ?? 0);
  }
}
