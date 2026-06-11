import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  item: {
    findMany: jest.fn(),
  },
};

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return items for the current owner', async () => {
    mockPrisma.item.findMany.mockResolvedValue([{ id: 1, owner_id: 10 }]);
    const items = await service.findAll(10);
    expect(items).toEqual([{ id: 1, owner_id: 10 }]);
    expect(mockPrisma.item.findMany).toHaveBeenCalledWith({ where: { owner_id: 10 } });
  });
});
