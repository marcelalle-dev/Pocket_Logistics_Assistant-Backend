import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ExchangeRatesModule } from './exchange-rates/exchange-rates.module';
import { LandedCostsModule } from './landed-costs/landed-costs.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ItemsModule } from './items/items.module';
import { ParcelsModule } from './parcels/parcels.module';
import { PrismaModule } from './prisma/prisma.module';
import { TripsModule } from './trips/trips.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TripsModule,
    CategoriesModule,
    ItemsModule,
    ParcelsModule,
    ExpensesModule,
    ExchangeRatesModule,
    LandedCostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
