import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRatesService } from './exchange-rates.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  exchangeRate: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ExchangeRatesService', () => {
  let service: ExchangeRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRatesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ExchangeRatesService>(ExchangeRatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all exchange rates', async () => {
    mockPrisma.exchangeRate.findMany.mockResolvedValue([{ id: 1, rate: 650 }]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, rate: 650 }]);
    expect(mockPrisma.exchangeRate.findMany).toHaveBeenCalled();
  });
});
