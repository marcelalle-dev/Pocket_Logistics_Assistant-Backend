import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  expense: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  trip: {
    findUnique: jest.fn(),
  },
  parcel: {
    findUnique: jest.fn(),
  },
};

describe('ExpensesService', () => {
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list expenses for owner', async () => {
    mockPrisma.expense.findMany.mockResolvedValue([{ id: 1, amount_cfa: 1000 }]);
    const result = await service.findAll(7);
    expect(result).toEqual([{ id: 1, amount_cfa: 1000 }]);
    expect(mockPrisma.expense.findMany).toHaveBeenCalledWith({
      where: {
        trip: { owner_id: 7 },
      },
      include: { trip: true, parcel: true },
    });
  });
});
