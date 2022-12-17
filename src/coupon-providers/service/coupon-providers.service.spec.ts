import { Test, TestingModule } from '@nestjs/testing';
import { CouponProvidersService } from './coupon-providers.service';

describe('CouponProvidersService', () => {
  let provider: CouponProvidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponProvidersService
      ],
    }).compile();

    provider = module.get<CouponProvidersService>(CouponProvidersService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
