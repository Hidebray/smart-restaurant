import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from '../events/orders.gateway';

describe.skip('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            // Add mock methods here as needed, or use a generic mock
            order: { findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
            $transaction: jest.fn((cb) => cb({
              product: { findUnique: jest.fn() },
              modifierOption: { findMany: jest.fn() },
              order: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
              table: { update: jest.fn() },
            })),
          },
        },
        {
          provide: OrdersGateway,
          useValue: {
            emitNewOrderToWaiters: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
