import { Module } from '@nestjs/common';
import { LandedCostsService } from './landed-costs.service';
import { LandedCostsController } from './landed-costs.controller';

@Module({
  providers: [LandedCostsService],
  controllers: [LandedCostsController],
  exports: [LandedCostsService],
})
export class LandedCostsModule {}
