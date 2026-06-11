import { Test, TestingModule } from '@nestjs/testing';
import { ParcelsService } from './parcels.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  parcel: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  parcel_Item: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  item: {
    findUnique: jest.fn(),
  },
  trip: {
    findUnique: jest.fn(),
  },
};

describe('ParcelsService', () => {
  let service: ParcelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParcelsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ParcelsService>(ParcelsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return parcels for owner', async () => {
    mockPrisma.parcel.findMany.mockResolvedValue([{ id: 1, owner_id: 5 }]);
    const result = await service.findAll(5);
    expect(result).toEqual([{ id: 1, owner_id: 5 }]);
    expect(mockPrisma.parcel.findMany).toHaveBeenCalledWith({ where: { owner_id: 5 } });
  });
});
