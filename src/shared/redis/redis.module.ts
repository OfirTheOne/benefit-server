import { Module, OnModuleInit } from '@nestjs/common';
import { RedisProvider } from './redis.provider';

@Module({
  providers: [RedisProvider],
  exports: [RedisProvider]
})
export class RedisModule implements OnModuleInit {
  constructor(private redisProvider: RedisProvider) { }

  async onModuleInit() {
    try {
      await this.redisProvider.initConnection()
      console.log('redisProvider.initConnection done!');
    } catch (error) {
      console.log(error);
      throw error;
    }
    try {
      await this.redisProvider.initJsonIndexes();
      console.log('redisProvider.initJsonIndexes done!');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
