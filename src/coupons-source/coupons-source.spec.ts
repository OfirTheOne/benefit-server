import { Test, TestingModule } from '@nestjs/testing';
import { HapoalimScrapper } from '../coupon-providers/providers/hapoalim/hapoalim-scrapper';
import { CouponsSource } from './coupons-source';

describe('CouponsSource', () => {
  let provider: CouponsSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HapoalimScrapper,
          useValue: {
            scrap: jest.fn()
          }
        },
        CouponsSource
      ],
    }).compile();

    provider = module.get<CouponsSource>(CouponsSource);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
