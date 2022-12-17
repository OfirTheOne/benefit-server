import { Test, TestingModule } from '@nestjs/testing';
import { Scrapper } from './scrapper.provider';

describe('Scrapper', () => {
  let provider: Scrapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Scrapper],
    }).compile();

    provider = module.get<Scrapper>(Scrapper);
  });

  it('should be defined', async () => {

    // const res = await provider.test();
    // console.log(res);
    expect(provider).toBeDefined();
  }, 50 * 1000);
});
