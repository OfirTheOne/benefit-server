import { Test, TestingModule } from '@nestjs/testing';
import { CouponsRepository } from './coupons.repository';

describe('CouponsRepository', () => {
  let provider: CouponsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsRepository
      ],
    }).compile();

    provider = module.get<CouponsRepository>(CouponsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
